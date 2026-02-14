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

// ---- GENERATE: Full pipeline for new UI ----

export async function orchestrateGeneration(
  userPrompt: string,
  currentVersion: number
): Promise<GenerationResult> {
  const sanitizedPrompt = sanitizePrompt(userPrompt);

  console.log('[Orchestrator] Step 1: Running Planner...');
  const plan = await runPlanner(sanitizedPrompt);
  console.log('[Orchestrator] Planner complete. Layout:', plan.layout, 'Components:', plan.components.length);

  console.log('[Orchestrator] Step 2: Running Generator...');
  const generation = await runGenerator(plan);
  console.log('[Orchestrator] Generator complete. Components used:', generation.componentList);

  const validation = validateGeneratedCode(generation.code);
  if (!validation.isValid) {
    console.warn('[Orchestrator] Validation warnings:', validation.errors);
  }

  console.log('[Orchestrator] Step 3: Running Explainer...');
  const explanation = await runExplainer(sanitizedPrompt, plan, generation);
  console.log('[Orchestrator] Explainer complete.');

  return {
    plan,
    generation,
    explanation,
    version: currentVersion + 1,
    timestamp: new Date().toISOString(),
    userPrompt: sanitizedPrompt,
  };
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
      components: componentList.map(type => ({
        type,
        props: {},
        children: [],
      })),
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