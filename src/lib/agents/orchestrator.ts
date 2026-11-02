// ============================================
// AI ORCHESTRATOR
// Supports dual modes:
// - deterministic: legacy constrained component pipeline
// - creative: multi-target (web + expo-rn) pipeline
// ============================================

import {
  GenerationResult,
  ModifyRequest,
  GenerationEvent,
  GenerationMode,
  GenerationTarget,
  TargetPreference,
  PlannerOutput,
  ComponentType,
} from '@/types';
import { runPlanner } from './planner';
import { repairGeneratedCode, runGenerator } from './generator';
import { runExplainer } from './explainer';
import { runModifier } from './modifier';
import { validateGeneratedArtifact, validateGeneratedCode, sanitizePrompt } from '../validation';
import { resolveGenerationMode, resolveTarget } from './strategy';

interface OrchestrationOptions {
  generationMode?: GenerationMode;
  targetPreference?: TargetPreference;
}

type ModificationRequest = ModifyRequest & {
  previousLayout?: string;
  previousComponentList?: string[];
};

export async function orchestrateGeneration(
  userPrompt: string,
  currentVersion: number,
  onEvent?: (e: GenerationEvent) => void,
  options: OrchestrationOptions = {}
): Promise<GenerationResult> {
  const sanitizedPrompt = sanitizePrompt(userPrompt);
  const mode = resolveGenerationMode(options.generationMode);
  const target = resolveTarget(sanitizedPrompt, options.targetPreference);

  if (onEvent) {
    onEvent({
      type: 'planner_start',
      message: `Analyzing request (${mode} mode, ${target} target)...`,
      data: { mode, target },
    });
  }

  console.log('[Orchestrator] Step 1: Running Planner...');
  const plan = await runPlanner(sanitizedPrompt, { mode, target });
  console.log('[Orchestrator] Planner complete. Layout:', plan.layout, 'Blocks:', plan.blocks?.length);
  if (onEvent) {
    onEvent({
      type: 'planner_done',
      message: `Planned ${plan.blocks?.length || 0} blocks`,
      data: { ...plan, mode, target },
    });
  }

  console.log('[Orchestrator] Step 2: Running Generator...');
  const generated = await runGenerator(plan, onEvent, { mode, target, userPrompt: sanitizedPrompt });
  const generatedCode = generated.primaryCode || generated.code;
  const primaryCode = await validateOrRepairGeneratedCode(generatedCode, {
    mode,
    target,
    userPrompt: sanitizedPrompt,
    onEvent,
  });
  const generation = { ...generated, code: primaryCode, primaryCode };

  const validation = validateGeneratedCode(primaryCode, { mode, target });
  if (validation.warnings.length > 0) {
    console.warn('[Orchestrator] Validation warnings:', validation.warnings);
  }

  if (onEvent) {
    onEvent({ type: 'explainer_start', message: 'Generating documentation...' });
  }
  console.log('[Orchestrator] Step 3: Running Explainer...');
  const explanation = await runExplainer(sanitizedPrompt, plan, generation, { mode, target });
  console.log('[Orchestrator] Explainer complete.');
  if (onEvent) {
    onEvent({ type: 'explainer_done', message: 'Documentation complete' });
  }

  const metadata = generation.metadata ?? {
    mode,
    target,
    runtime: target === 'expo-rn' ? ('expo-rn' as const) : ('nextjs' as const),
    selectedLibraries: generation.componentList || [],
  };

  const finalResult: GenerationResult = {
    plan: {
      ...plan,
      target,
    },
    generation: {
      ...generation,
      code: primaryCode,
      primaryCode,
      metadata,
    },
    explanation,
    metadata,
    version: currentVersion + 1,
    timestamp: new Date().toISOString(),
    userPrompt: sanitizedPrompt,
  };

  if (onEvent) {
    onEvent({
      type: 'complete',
      message: `Generation complete (${mode} · ${target})`,
      data: finalResult,
    });
  }
  return finalResult;
}

export async function orchestrateModification(
  request: ModificationRequest
): Promise<GenerationResult> {
  const sanitizedPrompt = sanitizePrompt(request.prompt);
  const mode = resolveGenerationMode(request.generationMode || request.previousMode);
  const target = resolveTarget(sanitizedPrompt, request.targetPreference || request.previousTarget);

  console.log('[Orchestrator] Modification requested:', sanitizedPrompt);

  // Step 1: Run modifier with previous context
  console.log('[Orchestrator] Step 1: Running Modifier...');
  const { code, componentList, changes, changeDetails, previewArtifact, metadata: modifierMetadata } = await runModifier(
    sanitizedPrompt,
    request.currentCode,
    {
      layout: request.previousLayout,
      componentList: request.previousComponentList,
      conversationContext: request.conversationContext,
      currentTitle: request.currentTitle,
    },
    { mode, target }
  );

  const validatedCode = await validateOrRepairGeneratedCode(code, {
    mode,
    target,
    userPrompt: sanitizedPrompt,
  });
  const validation = validateGeneratedCode(validatedCode, { mode, target });
  if (validation.warnings.length > 0) {
    console.warn('[Orchestrator] Validation warnings:', validation.warnings);
  }

  // Step 2: Re-run planner for updated preview tree/brief
  console.log('[Orchestrator] Step 2: Running Planner for updated preview context...');
  let plan: PlannerOutput;
  try {
    plan = await runPlanner(`${sanitizedPrompt} (modifying existing ${target} app: ${changes})`, { mode, target });
  } catch {
    console.warn('[Orchestrator] Planner failed for modification preview, using fallback');
    plan = buildFallbackPlan(request.previousLayout, componentList, target, mode, changes);
  }

  const changeSummary = [
    changeDetails.added.length > 0 ? `Added: ${changeDetails.added.join(', ')}` : '',
    changeDetails.removed.length > 0 ? `Removed: ${changeDetails.removed.join(', ')}` : '',
    changeDetails.modified.length > 0 ? `Modified: ${changeDetails.modified.join(', ')}` : '',
  ].filter(Boolean).join('. ');

  plan.reasoning = `Modification: ${changes}${changeSummary ? `. ${changeSummary}` : ''}`;

  const generation = {
    code: validatedCode,
    primaryCode: validatedCode,
    componentList,
    previewArtifact,
    metadata: modifierMetadata,
  };

  console.log('[Orchestrator] Step 3: Creating explanation...');
  const explanation = await runExplainer(sanitizedPrompt, plan, generation, { mode, target });

  return {
    plan,
    generation,
    explanation,
    metadata: modifierMetadata,
    version: request.currentVersion + 1,
    timestamp: new Date().toISOString(),
    userPrompt: sanitizedPrompt,
  };
}

const MAX_GENERATED_CODE_REPAIRS = 2;

async function validateOrRepairGeneratedCode(
  initialCode: string,
  options: {
    mode: GenerationMode;
    target: GenerationTarget;
    userPrompt: string;
    onEvent?: (event: GenerationEvent) => void;
  }
): Promise<string> {
  const { mode, target, userPrompt, onEvent } = options;
  const format = target === 'expo-rn' ? 'expo' : 'tsx';
  let candidate = initialCode;

  for (let attempt = 0; attempt <= MAX_GENERATED_CODE_REPAIRS; attempt += 1) {
    const artifactValidation = validateGeneratedArtifact({ format, code: candidate }, format);
    const codeValidation = validateGeneratedCode(candidate, { mode, target });
    const diagnostics = [
      artifactValidation.diagnostics,
      ...codeValidation.errors.map((error) => `Generated-code safety validation: ${error}`),
    ].filter(Boolean).join('\n');

    if (artifactValidation.isValid && codeValidation.isValid) {
      if (codeValidation.warnings.length > 0) {
        console.warn('[Orchestrator] Validation warnings:', codeValidation.warnings);
      }
      return candidate;
    }

    if (attempt === MAX_GENERATED_CODE_REPAIRS) {
      throw new Error(`Generated code did not pass validation after ${MAX_GENERATED_CODE_REPAIRS} automatic repair attempts.\n${diagnostics}`);
    }

    console.warn(`[Orchestrator] Generated code failed validation; running repair ${attempt + 1}/${MAX_GENERATED_CODE_REPAIRS}.`, diagnostics);
    onEvent?.({
      type: 'agent_start',
      agentId: 'validation-repair',
      agentName: 'Syntax Repair',
      message: `Correcting validation errors (attempt ${attempt + 1}/${MAX_GENERATED_CODE_REPAIRS})...`,
    });
    candidate = await repairGeneratedCode(candidate, diagnostics, { mode, target, userPrompt });
    onEvent?.({
      type: 'agent_done',
      agentId: 'validation-repair',
      agentName: 'Syntax Repair',
      message: 'Rechecking corrected implementation...',
    });
  }

  throw new Error('Generated code validation failed.');
}

function buildFallbackPlan(
  previousLayout: string | undefined,
  componentList: string[],
  target: GenerationTarget,
  mode: GenerationMode,
  changes: string
): PlannerOutput {
  const deterministicAllowed = new Set<ComponentType>([
    'Button',
    'Card',
    'Input',
    'Table',
    'Modal',
    'Sidebar',
    'Navbar',
    'Chart',
    'Badge',
    'Avatar',
    'Progress',
    'Stat',
    'Alert',
    'Toggle',
    'Tabs',
    'Divider',
    'Select',
  ]);

  const normalizedLayout = (
    previousLayout as PlannerOutput['layout'] | undefined
  ) || (target === 'expo-rn' ? 'app-shell' : 'single-column');

  return {
    layout: normalizedLayout,
    target,
    blocks: [
      {
        id: 'modified-content',
        description: 'Modified UI content',
        components: mode === 'deterministic'
          ? componentList
              .filter((item): item is ComponentType => deterministicAllowed.has(item as ComponentType))
              .map((type) => ({
                type,
                props: {},
                children: [],
              }))
          : [],
      },
    ],
    reasoning: `Fallback modification plan: ${changes}`,
    designBrief: mode === 'creative'
      ? `Modify and polish the existing ${target === 'expo-rn' ? 'mobile' : 'web'} app while preserving UX consistency.`
      : undefined,
    wireframePlan: mode === 'creative'
      ? ['Keep current structure', 'Apply requested changes in targeted sections']
      : undefined,
    motionPlan: mode === 'creative'
      ? ['Preserve existing interaction model', 'Enhance changed surfaces with coherent transitions']
      : undefined,
    implementationPlan: mode === 'creative'
      ? ['Patch requested areas', 'Re-validate interaction and visual consistency']
      : undefined,
  };
}
