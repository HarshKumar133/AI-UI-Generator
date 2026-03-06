// ============================================
// AI ORCHESTRATOR
// Orchestrates the 3-step agent pipeline:
//   1. Planner  → Structured plan
//   2. Generator → React code
//   3. Explainer → Human explanation
// Also handles modification (iterative edit) flow
// ============================================

import { GenerationResult, ModifyRequest } from '@/types';
import { runPlanner } from './planner';
import { runGenerator } from './generator';
import { runExplainer } from './explainer';
import { runModifier } from './modifier';
import { validateGeneratedCode, sanitizePrompt } from '../validation';
import { GenerationEvent } from '@/types';

// ---- GENERATE: Full pipeline for new UI ----

export async function orchestrateGeneration(
  userPrompt: string,
  currentVersion: number,
  onEvent?: (e: GenerationEvent) => void
): Promise<GenerationResult> {
  const sanitizedPrompt = sanitizePrompt(userPrompt);

  if (onEvent) onEvent({ type: 'planner_start', message: 'Analyzing request and planning UI blocks...' });
  console.log('[Orchestrator] Step 1: Running Planner...');
  const plan = await runPlanner(sanitizedPrompt);
  console.log('[Orchestrator] Planner complete. Layout:', plan.layout, 'Blocks:', plan.blocks?.length);
  if (onEvent) onEvent({ type: 'planner_done', message: `Planned ${plan.blocks?.length || 0} blocks`, data: plan });

  console.log('[Orchestrator] Step 2: Running Generator instances in parallel...');
  const generation = await runGenerator(plan, onEvent);

  const validation = validateGeneratedCode(generation.code);
  if (!validation.isValid) {
    console.warn('[Orchestrator] Validation warnings:', validation.errors);
  }

  if (onEvent) onEvent({ type: 'explainer_start', message: 'Generating documentation...' });
  console.log('[Orchestrator] Step 3: Running Explainer...');
  const explanation = await runExplainer(sanitizedPrompt, plan, generation);
  console.log('[Orchestrator] Explainer complete.');
  if (onEvent) onEvent({ type: 'explainer_done', message: 'Documentation complete' });

  const finalResult = {
    plan,
    generation,
    explanation,
    version: currentVersion + 1,
    timestamp: new Date().toISOString(),
    userPrompt: sanitizedPrompt,
  };

  if (onEvent) onEvent({ type: 'complete', message: 'Generation complete', data: finalResult });
  return finalResult;
}

// ---- MODIFY: Iterative edit pipeline (context-aware) ----

export async function orchestrateModification(
  request: ModifyRequest & { previousLayout?: string; previousComponentList?: string[] }
): Promise<GenerationResult> {
  const sanitizedPrompt = sanitizePrompt(request.prompt);

  console.log('[Orchestrator] Modification requested:', sanitizedPrompt);

  // Step 1: Run modifier with previous context
  console.log('[Orchestrator] Step 1: Running Modifier (context-aware)...');
  const { code, componentList, changes, changeDetails } = await runModifier(
    sanitizedPrompt,
    request.currentCode,
    {
      layout: request.previousLayout,
      componentList: request.previousComponentList as import('@/types').ComponentType[],
    }
  );

  const validation = validateGeneratedCode(code);
  if (!validation.isValid) {
    console.warn('[Orchestrator] Validation warnings:', validation.errors);
  }

  // Step 2: Re-run the planner to get a proper component tree for preview
  console.log('[Orchestrator] Step 2: Running Planner for preview tree...');
  let plan;
  try {
    plan = await runPlanner(sanitizedPrompt + ` (modifying existing UI: ${changes})`);
  } catch {
    // Fallback: create a minimal plan from the component list
    console.warn('[Orchestrator] Planner failed for modification preview, using fallback');
    plan = {
      layout: (request.previousLayout || 'single-column') as 'single-column' | 'two-column' | 'sidebar-layout' | 'dashboard' | 'centered' | 'full-width',
      blocks: [
        {
          id: 'modified-content',
          description: 'Modified UI components',
          components: componentList.map(type => ({
            type,
            props: {},
            children: [],
          }))
        }
      ],
      reasoning: `Modification: ${changes}`,
    };
  }

  // Step 3: Create explanation with change details
  console.log('[Orchestrator] Step 3: Creating explanation...');
  const changeSummary = [
    changeDetails.added.length > 0 ? `Added: ${changeDetails.added.join(', ')}` : '',
    changeDetails.removed.length > 0 ? `Removed: ${changeDetails.removed.join(', ')}` : '',
    changeDetails.modified.length > 0 ? `Modified: ${changeDetails.modified.join(', ')}` : '',
  ].filter(Boolean).join('. ');

  // Update the plan reasoning with change details
  plan.reasoning = `Modification: ${changes}${changeSummary ? `. ${changeSummary}` : ''}`;

  const generation = { code, componentList };
  const explanation = await runExplainer(sanitizedPrompt, plan, generation);

  return {
    plan,
    generation,
    explanation,
    version: request.currentVersion + 1,
    timestamp: new Date().toISOString(),
    userPrompt: sanitizedPrompt,
  };
}