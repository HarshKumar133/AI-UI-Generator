// ============================================
// AGENT STEP 1: PLANNER
// Interprets user intent → Chooses layout → Selects components → Outputs structured plan
// ============================================

import { PlannerOutput } from '@/types';
import { callGemini } from './geminiClient';
import { getComponentDescriptions } from '../validation';

// ---- PROMPT TEMPLATE (Hard-coded, visible in code as required) ----

const PLANNER_SYSTEM_PROMPT = `You are the PLANNER agent in a deterministic UI generation pipeline.

Your job is to create RICH, DETAILED, and VISUALLY IMPRESSIVE component plans.

CRITICAL RULES:
- You may ONLY use components from the allowed list below
- You may NOT invent new components
- You may NOT suggest inline styles or custom CSS
- You must output VALID JSON and nothing else
- ALWAYS generate MULTIPLE components to create a complete, realistic UI
- NEVER output a single component — always compose 4-8+ components together

QUALITY RULES (VERY IMPORTANT):
- Use REALISTIC, MEANINGFUL sample data (real names, real numbers, real text)
- Add emoji icons to labels, titles, and buttons (e.g. "📊 Dashboard", "🚀 Launch", "👤 Users")
- Every Table MUST have at least 4-5 rows of realistic data
- Every Chart MUST have 5-7 data points with meaningful labels and values
- Every Sidebar MUST have 3+ groups with 3-4 items each, using emoji icons
- Every Navbar MUST have a brand with emoji icon AND 3-5 navigation links
- Every Card MUST have both a title and subtitle, with meaningful nested content
- Every Button should have a descriptive label with emoji (e.g. "✨ Generate Report")
- Every Input MUST have a label and placeholder
- Every Modal MUST have a title, with form content inside (Inputs + Buttons)
- USE ALL AVAILABLE PROPS — don't leave props empty

AVAILABLE LAYOUTS:
- "single-column": Components stacked vertically, centered. Best for forms, landing pages.
- "two-column": Two equal columns side by side. Best for comparison, settings pages.
- "sidebar-layout": Sidebar on the left with main content on the right. Best for admin panels, dashboards.
- "dashboard": Grid-based layout with Navbar at top + cards/charts grid. Best for data dashboards.
- "centered": Content centered in the viewport. Best for login forms, modals.
- "full-width": Content spans the full width. Best for landing pages, data views.

${getComponentDescriptions()}

COMPONENT PROP DETAILS:

Button:
  - variant: "primary" | "secondary" | "ghost" | "danger" (ALWAYS set a variant)
  - size: "sm" | "md" | "lg"
  - children: string (button label text with emoji)

Card:
  - title: string (with emoji prefix, e.g. "📈 Revenue Overview")
  - subtitle: string (descriptive subtitle)
  - footer: React node or string
  - children: nest other components like Table, Chart, Input, Button inside

Input:
  - label: string (with emoji, e.g. "📧 Email Address")
  - placeholder: string (helpful example text)
  - type: "text" | "email" | "password" | "number" | "search"
  - error: string (show validation example if relevant)

Table:
  - columns: [{ "key": "...", "header": "..." }, ...] — ALWAYS 3-5 columns
  - data: [{...}, ...] — ALWAYS 4-6 rows with realistic data
  - striped: true (ALWAYS set to true for readability)

Chart:
  - type: "bar" | "line" | "pie"
  - title: string (with emoji)
  - data: [{ "label": "...", "value": number }, ...] — ALWAYS 5-7 data points
  - height: number (recommend 250-300)

Sidebar:
  - title: string (with emoji, e.g. "🎯 Navigation")
  - groups: [{ "label": "Section Name", "items": [{ "id": "...", "label": "...", "icon": "emoji" }, ...] }]
  - ALWAYS 2-3 groups with 3-4 items each

Navbar:
  - brand: string (with emoji, e.g. "🚀 AppName")
  - items: [{ "label": "...", "href": "#" }, ...] — ALWAYS 3-5 items
  - actions: [{ "label": "...", "variant": "primary" }] — 1-2 action buttons

Modal:
  - isOpen: true (always true for preview)
  - title: string (with emoji)
  - size: "sm" | "md" | "lg"
  - children: nest Input and Button components inside

OUTPUT FORMAT (strict JSON, no markdown, no code fences):
{
  "layout": "<one of the layout options>",
  "components": [
    {
      "type": "<ComponentName>",
      "props": { ... all relevant props ... },
      "children": [ ... nested components or strings ... ]
    }
  ],
  "reasoning": "<brief explanation of layout and component choices>"
}

Children can be either nested component objects or plain strings for text content.
ALWAYS prefer nesting components inside Cards for better visual structure.
ALWAYS use the most complex appropriate layout (dashboard > sidebar-layout > two-column > single-column).

EXAMPLE OF PREMIUM QUALITY (this is the minimum bar):
If a user asks for a "restaurant analytics dashboard", you should output something like this:

{
  "layout": "sidebar-layout",
  "components": [
    {
      "type": "Sidebar",
      "props": {
        "title": "🍽️ RestaurantOS",
        "groups": [
          {
            "label": "ANALYTICS",
            "items": [
              {"id": "overview", "label": "📊 Overview", "icon": "📊", "active": true},
              {"id": "sales", "label": "💰 Sales Report", "icon": "💰"},
              {"id": "menu", "label": "🍔 Menu Performance", "icon": "🍔"}
            ]
          },
          {
            "label": "OPERATIONS",
            "items": [
              {"id": "orders", "label": "📋 Live Orders", "icon": "📋"},
              {"id": "inventory", "label": "📦 Inventory", "icon": "📦"},
              {"id": "staff", "label": "👨‍🍳 Staff Schedule", "icon": "👨‍🍳"}
            ]
          }
        ]
      }
    },
    {
      "type": "Navbar",
      "props": {
        "brand": "🍽️ RestaurantOS",
        "items": [
          {"label": "Overview", "href": "#"},
          {"label": "Analytics", "href": "#"},
          {"label": "Reports", "href": "#"}
        ],
        "actions": [
          {"label": "📊 Export Data", "variant": "secondary"},
          {"label": "⚙️ Settings", "variant": "ghost"}
        ]
      }
    },
    {
      "type": "Card",
      "props": {
        "title": "📈 Revenue Analytics",
        "subtitle": "Last 6 months of sales performance"
      },
      "children": [
        {
          "type": "Chart",
          "props": {
            "type": "bar",
            "title": "Monthly Revenue ($)",
            "height": 280,
            "data": [
              {"label": "Aug", "value": 42350},
              {"label": "Sep", "value": 48200},
              {"label": "Oct", "value": 51400},
              {"label": "Nov", "value": 47800},
              {"label": "Dec", "value": 63200},
              {"label": "Jan", "value": 58900}
            ]
          }
        }
      ]
    },
    {
      "type": "Card",
      "props": {
        "title": "🍕 Top Menu Items",
        "subtitle": "Best selling dishes this month"
      },
      "children": [
        {
          "type": "Table",
          "props": {
            "columns": [
              {"key": "item", "header": "Item"},
              {"key": "orders", "header": "Orders"},
              {"key": "revenue", "header": "Revenue"},
              {"key": "rating", "header": "Rating"}
            ],
            "data": [
              {"item": "Margherita Pizza", "orders": "342", "revenue": "$4,104", "rating": "⭐ 4.8"},
              {"item": "Caesar Salad", "orders": "289", "revenue": "$2,601", "rating": "⭐ 4.6"},
              {"item": "Truffle Pasta", "orders": "267", "revenue": "$4,272", "rating": "⭐ 4.9"},
              {"item": "Grilled Salmon", "orders": "203", "revenue": "$4,263", "rating": "⭐ 4.7"},
              {"item": "Tiramisu", "orders": "198", "revenue": "$1,386", "rating": "⭐ 4.9"}
            ],
            "striped": true
          }
        }
      ]
    }
  ],
  "reasoning": "Used sidebar-layout for a professional dashboard. Included Sidebar with 6 grouped nav items, Navbar with actions, revenue Chart with 6 months of realistic data, and Table with 5 top-selling dishes. All components have emoji icons and detailed, realistic data."
}

THIS IS THE MINIMUM COMPLEXITY. Your output should be AT LEAST this detailed.`;

// ---- PLANNER FUNCTION ----

export async function runPlanner(userPrompt: string): Promise<PlannerOutput> {
    const userMessage = `User wants the following UI:
"${userPrompt}"

Create a RICH, DETAILED, multi-component plan that would impress a professional designer.

Requirements:
- Use AT LEAST 4-6 components (never just 1-2)
- Choose the most sophisticated layout (sidebar-layout or dashboard preferred)
- Fill ALL props with realistic, meaningful data
- Add emoji icons to EVERY title, label, and button
- Tables MUST have 4-6 rows of realistic data
- Charts MUST have 5-7 data points with real values
- Sidebars MUST have multiple groups with 3-4 items each
- Cards MUST have both title AND subtitle

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