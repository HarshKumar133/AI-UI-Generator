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
import { runGenerator } from './generator';
import { runExplainer } from './explainer';
import { runModifier } from './modifier';
import { validateGeneratedCode, sanitizePrompt } from '../validation';
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
  const generation = await runGenerator(plan, onEvent, { mode, target });

  const primaryCode = generation.primaryCode || generation.code;
  const validation = validateGeneratedCode(primaryCode, { mode, target });
  if (!validation.isValid) {
    console.warn('[Orchestrator] Validation errors:', validation.errors);
  }
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
    },
    { mode, target }
  );

  const validation = validateGeneratedCode(code, { mode, target });
  if (!validation.isValid) {
    console.warn('[Orchestrator] Validation errors:', validation.errors);
  }
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
    code,
    primaryCode: code,
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
