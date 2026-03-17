// ============================================
// AGENT STEP 3: EXPLAINER
// Explains AI decisions in plain English
// References layout and component choices
// ============================================

import { PlannerOutput, GeneratorOutput, ExplainerOutput, GenerationMode, GenerationTarget } from '@/types';
import { callGemini } from './geminiClient';

// ---- PROMPT TEMPLATE (Hard-coded, visible in code as required) ----

const EXPLAINER_SYSTEM_PROMPT = `You are the EXPLAINER agent in a deterministic UI generation pipeline.

Your job is to explain, in plain English, the decisions made by the Planner and Generator agents.

You must:
1. Explain the overall layout choice and WHY it was selected
2. For each component used, explain WHY it was chosen and how it fulfills the user's intent
3. Be concise but thorough
4. Reference specific component names and props

OUTPUT FORMAT (strict JSON, no markdown, no code fences):
{
  "explanation": "<2-3 sentence summary of what was built and why>",
  "componentChoices": [
    {
      "component": "<ComponentName>",
      "reason": "<why this component was chosen>"
    }
  ],
  "layoutReason": "<why this specific layout was chosen>"
}

Return ONLY the JSON, nothing else.`;

const CREATIVE_EXPLAINER_SYSTEM_PROMPT = `You are the EXPLAINER agent for a creative multi-target app builder.

Explain decisions in plain English with emphasis on:
1. Product UX strategy and visual direction
2. Why selected libraries/tools fit the target platform
3. How motion/interaction choices improve usability

Return strict JSON:
{
  "explanation": "2-4 sentence summary",
  "componentChoices": [
    { "component": "library/component/screen", "reason": "why selected" }
  ],
  "layoutReason": "why this structure fits the target use case"
}
`;

interface ExplainerRunOptions {
    mode?: GenerationMode;
    target?: GenerationTarget;
}

// ---- EXPLAINER FUNCTION ----

export async function runExplainer(
    userPrompt: string,
    plan: PlannerOutput,
    generation: GeneratorOutput,
    options: ExplainerRunOptions = {}
): Promise<ExplainerOutput> {
    const mode = options.mode ?? generation.metadata?.mode ?? 'creative';
    const target = options.target ?? generation.metadata?.target ?? plan.target ?? 'web';
    const userMessage = `The user requested: "${userPrompt}"

The Planner chose:
- Layout: "${plan.layout}"
- Components: ${generation.componentList.join(', ')}
- Planner reasoning: "${plan.reasoning}"
- Target: "${target}"
- Design brief: "${plan.designBrief || 'N/A'}"
- Motion plan: ${(plan.motionPlan || []).join(' | ') || 'N/A'}

The Generator produced code using these components: ${generation.componentList.join(', ')}

Explain the decisions made. Why was this layout chosen? Why was each component selected? How does the result fulfill the user's intent?

Output ONLY the JSON explanation, no other text.`;

    const response = await callGemini(
        userMessage,
        mode === 'deterministic' ? EXPLAINER_SYSTEM_PROMPT : CREATIVE_EXPLAINER_SYSTEM_PROMPT
    );

    // Clean the response
    let cleanResponse = response.trim();

    // Remove markdown code fences if present
    if (cleanResponse.startsWith('`')) {
        cleanResponse = cleanResponse.replace(/^`{3}(?:json)?\s*\n?/, '').replace(/\n?`{3}\s*$/, '');
    }

    try {
        const explanation: ExplainerOutput = JSON.parse(cleanResponse);

        // Validate structure
        if (!explanation.explanation) {
            explanation.explanation = 'UI generated based on your request.';
        }
        if (!explanation.componentChoices || !Array.isArray(explanation.componentChoices)) {
            explanation.componentChoices = generation.componentList.map(comp => ({
                component: comp,
                reason: `Used to fulfill the user's UI requirements.`,
            }));
        }
        if (!explanation.layoutReason) {
            explanation.layoutReason = `The "${plan.layout}" layout was selected to best match the requested UI structure.`;
        }

        return explanation;
    } catch (error) {
        // Fallback explanation if JSON parsing fails
        console.error('Explainer JSON parse error:', error);

        return {
            explanation: `Generated a ${target} ${plan.layout} layout using ${generation.componentList.join(', ')} based on your request: "${userPrompt}".`,
            componentChoices: generation.componentList.map(comp => ({
                component: comp,
                reason: `Selected to fulfill the requested UI functionality.`,
            })),
            layoutReason: `The "${plan.layout}" layout was chosen as the most appropriate structure for this type of UI.`,
        };
    }
}
