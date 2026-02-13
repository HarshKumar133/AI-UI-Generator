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
  // Step 0: Sanitize the prompt
  const sanitizedPrompt = sanitizePrompt(userPrompt);

  console.log('[Orchestrator] Step 1: Running Planner...');
  const plan = await runPlanner(sanitizedPrompt);
  console.log('[Orchestrator] Planner complete. Layout:', plan.layout, 'Components:', plan.components.length);

  console.log('[Orchestrator] Step 2: Running Generator...');
  const generation = await runGenerator(plan);
  console.log('[Orchestrator] Generator complete. Components used:', generation.componentList);

  // Validate the generated code
  const validation = validateGeneratedCode(generation.code);
  if (!validation.isValid) {
    console.warn('[Orchestrator] Validation warnings:', validation.errors);
    // We still proceed but log the issues
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

// ---- MODIFY: Iterative edit pipeline ----

export async function orchestrateModification(
  request: ModifyRequest
): Promise<GenerationResult> {
  const sanitizedPrompt = sanitizePrompt(request.prompt);

  console.log('[Orchestrator] Modification requested:', sanitizedPrompt);

  // Step 1: Run modifier (specialized planner + generator for edits)
  console.log('[Orchestrator] Step 1: Running Modifier...');
  const { code, componentList, changes } = await runModifier(
    sanitizedPrompt,
    request.currentCode
  );

  // Validate the modified code
  const validation = validateGeneratedCode(code);
  if (!validation.isValid) {
    console.warn('[Orchestrator] Validation warnings:', validation.errors);
  }

  // Step 2: Create an explanation of the changes
  console.log('[Orchestrator] Step 2: Creating explanation...');
  const plan = {
    layout: 'single-column' as const,
    components: [],
    reasoning: `Modification: ${changes}`,
  };

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