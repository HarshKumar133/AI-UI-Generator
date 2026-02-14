// ============================================
// AGENT STEP 3: EXPLAINER
// Explains AI decisions in plain English
// References layout and component choices
// ============================================

import { PlannerOutput, GeneratorOutput, ExplainerOutput } from '@/types';
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

// ---- EXPLAINER FUNCTION ----

export async function runExplainer(
    userPrompt: string,
    plan: PlannerOutput,
    generation: GeneratorOutput
): Promise<ExplainerOutput> {
    const userMessage = `The user requested: "${userPrompt}"

The Planner chose:
- Layout: "${plan.layout}"
- Components: ${generation.componentList.join(', ')}
- Planner reasoning: "${plan.reasoning}"

The Generator produced code using these components: ${generation.componentList.join(', ')}

Explain the decisions made. Why was this layout chosen? Why was each component selected? How does the result fulfill the user's intent?

Output ONLY the JSON explanation, no other text.`;

    const response = await callGemini(userMessage, EXPLAINER_SYSTEM_PROMPT);

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
            explanation: `Generated a ${plan.layout} layout using ${generation.componentList.join(', ')} components based on your request: "${userPrompt}".`,
            componentChoices: generation.componentList.map(comp => ({
                component: comp,
                reason: `Selected to fulfill the requested UI functionality.`,
            })),
            layoutReason: `The "${plan.layout}" layout was chosen as the most appropriate structure for this type of UI.`,
        };
    }
}