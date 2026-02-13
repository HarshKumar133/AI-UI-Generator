// ============================================
// AGENT STEP 1: PLANNER
// Interprets user intent → Chooses layout → Selects components → Outputs structured plan
// ============================================

import { PlannerOutput } from '@/types';
import { callGemini } from './geminiClient';
import { getComponentDescriptions } from '../validation';

// ---- PROMPT TEMPLATE (Hard-coded, visible in code as required) ----

const PLANNER_SYSTEM_PROMPT = `You are the PLANNER agent in a deterministic UI generation pipeline.

Your job is to:
1. Interpret the user's natural language UI intent
2. Choose an appropriate layout structure
3. Select components from the FIXED component library
4. Output a structured JSON plan

CRITICAL RULES:
- You may ONLY use components from the allowed list below
- You may NOT invent new components
- You may NOT suggest inline styles or custom CSS
- You must output VALID JSON and nothing else

AVAILABLE LAYOUTS:
- "single-column": Components stacked vertically, centered
- "two-column": Two equal columns side by side
- "sidebar-layout": Sidebar on the left with main content on the right
- "dashboard": Grid-based layout with cards and charts
- "centered": Content centered in the viewport
- "full-width": Content spans the full width

${getComponentDescriptions()}

OUTPUT FORMAT (strict JSON, no markdown, no code fences):
{
  "layout": "<one of the layout options>",
  "components": [
    {
      "type": "<ComponentName>",
      "props": { ... },
      "children": [ ... ]
    }
  ],
  "reasoning": "<brief explanation of why you chose this layout and these components>"
}

Children can be either nested component objects or plain strings for text content.
For Button children, always use a string like "Click Me".
For Card children, nest other components inside.
For Table, provide columns and data arrays in props.
For Chart, provide type and data array in props.
For Sidebar, provide groups array in props.
For Navbar, provide brand string and links array in props.
For Modal, set isOpen to true and provide title in props.`;

// ---- PLANNER FUNCTION ----

export async function runPlanner(userPrompt: string): Promise<PlannerOutput> {
  const userMessage = `User wants the following UI:
"${userPrompt}"

Analyze this request and create a structured component plan. Remember:
- Only use allowed components (Button, Card, Input, Table, Modal, Sidebar, Navbar, Chart)
- Choose the most appropriate layout
- Set meaningful props for each component
- Explain your reasoning

Output ONLY the JSON plan, no other text.`;

  const response = await callGemini(userMessage, PLANNER_SYSTEM_PROMPT);

  // Parse the JSON response, stripping any markdown fences the model might add
  let cleanResponse = response.trim();
  
  // Remove markdown code fences if present
  if (cleanResponse.startsWith('`')) {
    cleanResponse = cleanResponse.replace(/^`{3}(?:json)?\s*\n?/, '').replace(/\n?`{3}\s*$/, '');
  }

  try {
    const plan: PlannerOutput = JSON.parse(cleanResponse);

    // Validate the plan structure
    if (!plan.layout || !plan.components || !Array.isArray(plan.components)) {
      throw new Error('Invalid plan structure: missing layout or components');
    }

    // Validate layout value
    const validLayouts = ['single-column', 'two-column', 'sidebar-layout', 'dashboard', 'centered', 'full-width'];
    if (!validLayouts.includes(plan.layout)) {
      plan.layout = 'single-column'; // fallback
    }

    // Ensure reasoning exists
    if (!plan.reasoning) {
      plan.reasoning = 'Plan generated based on user intent.';
    }

    return plan;
  } catch (error) {
    // If JSON parsing fails, create a fallback plan
    console.error('Planner JSON parse error:', error);
    console.error('Raw response:', cleanResponse);

    return {
      layout: 'single-column',
      components: [
        {
          type: 'Card',
          props: { title: 'Generated UI' },
          children: [
            {
              type: 'Button',
              props: { variant: 'primary' },
              children: ['Get Started'],
            },
          ],
        },
      ],
      reasoning: 'Fallback plan generated due to parsing error. The AI response could not be parsed as valid JSON.',
    };
  }
}