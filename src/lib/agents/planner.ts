// ============================================
// AGENT STEP 1: PLANNER
// Interprets user intent → Chooses layout → Selects components → Outputs structured plan
// ============================================

import { PlannerOutput, PlannerBlock } from '@/types';
import { callGemini } from './geminiClient';
import { getComponentDescriptions } from '../validation';

// ---- PROMPT TEMPLATE ----

const PLANNER_SYSTEM_PROMPT = `You are the PLANNER agent in a UI generation pipeline.

Your job: read the user's request and produce a structured component plan.
Choose the layout and components that BEST FIT what they asked for — not the most complex option.

CRITICAL RULES:
- ONLY use components from the allowed list
- Output VALID JSON only — no markdown, no code fences
- Use REALISTIC, MEANINGFUL sample data (real names, numbers, text)
- Add emoji icons to labels, titles, and buttons where appropriate

AVAILABLE LAYOUTS — CHOOSE THE ONE THAT FITS THE REQUEST:
- "centered": Login/signup forms, single modals, error pages, confirmation screens
- "single-column": Articles, settings pages, simple lists, step-by-step forms
- "two-column": Split views, comparison pages, settings with preview
- "sidebar-layout": Admin panels, file browsers, apps with navigation menus
- "dashboard": Data dashboards with charts, KPIs, and tables
- "full-width": Landing pages, marketing pages, full-screen apps
- "landing-page": Hero + features grid + CTA — for SaaS, product, or portfolio sites
- "form-page": Clean focused form layout for onboarding/checkout/contact
- "app-shell": Full app with sidebar + top bar + main scrollable area

LAYOUT SELECTION GUIDE (IMPORTANT — follow this!):
- User asks for "login", "sign in", "sign up", "register" → "centered"
- User asks for "form", "checkout", "contact", "onboarding" → "form-page" or "centered"
- User asks for "landing page", "homepage", "marketing", "SaaS site" → "landing-page"
- User asks for "todo", "list", "notes", "simple app" → "single-column"
- User asks for "dashboard", "analytics", "metrics", "KPIs" → "dashboard"
- User asks for "admin panel", "CRM", "management app" → "sidebar-layout"
- User asks for "settings", "profile page", "preferences" → "two-column"
- When in doubt → "single-column"

COMPLEXITY GUIDE — match complexity to the request:
- Simple request (login form, todo) → 2-4 components is FINE
- Medium request (settings page, profile) → 4-6 components
- Complex request (dashboard, admin panel) → 6-10 components

${getComponentDescriptions()}

COMPONENT PROP DETAILS:

Button: variant ("primary"|"secondary"|"ghost"|"danger"|"outline"), size ("sm"|"md"|"lg"), children (label)
Card: title (with emoji), subtitle, children (nested components)
Input: label (with emoji), placeholder, type ("text"|"email"|"password"|"number"|"search")
Table: columns [{key, header}] (3-5), data (4-6 rows of realistic objects), striped: true
Chart: type ("bar"|"line"|"pie"), title, data [{label, value}] (5-7 points), height (250-300)
Sidebar: title (with emoji), groups [{label, items: [{id, label, icon, active?}]}]
Navbar: brand (with emoji), items [{label, href}], actions [{label, variant}]
Stat: label, value, trend ("+12%"), icon (emoji), subtitle
Badge: variant ("success"|"warning"|"error"|"info"|"default"), children (label text)
Avatar: name (required), status ("online"|"offline"|"busy"|"away"), size
Progress: value (0-100), label, color ("emerald"|"blue"|"amber"|"red"|"purple")
Alert: variant ("info"|"success"|"warning"|"error"), title, children (message text)
Toggle: label, checked (boolean)
Divider: label (optional), spacing
Select: label, options [{value, label}], placeholder
Tabs: items [{id, label, icon}]

OUTPUT FORMAT (strict JSON, no markdown):
{
  "layout": "<layout name>",
  "blocks": [
    {
      "id": "<block_id_kebab_case>",
      "description": "<What this block does and looks like>",
      "components": [
        {
          "type": "<ComponentName>",
          "props": { ...all props... },
          "children": [ ...nested component objects or strings... ]
        }
      ]
    }
  ],
  "reasoning": "<one sentence explaining the choice>"
}

Each block represents a major section of the UI (e.g. Header, Sidebar, MainPanel, Footer). These blocks will be built in PARALLEL by different AI agents, so their components should be completely disjoint and independent from other blocks.

Children can be nested component objects or plain strings for text.

--- EXAMPLES ---

User: "a login page"
{
  "layout": "centered",
  "blocks": [
    {
      "id": "login-form",
      "description": "Centered login form card",
      "components": [
        {
          "type": "Card",
          "props": { "title": "🔐 Sign In", "subtitle": "Welcome back — sign in to your account" },
          "children": [
            { "type": "Input", "props": { "label": "📧 Email", "placeholder": "you@company.com", "type": "email" } },
            { "type": "Input", "props": { "label": "🔑 Password", "placeholder": "Enter your password", "type": "password" } },
            { "type": "Button", "props": { "variant": "primary", "size": "lg", "fullWidth": true }, "children": ["Sign In →"] },
            { "type": "Divider", "props": { "label": "or" } },
            { "type": "Button", "props": { "variant": "outline", "fullWidth": true }, "children": ["Continue with Google"] }
          ]
        }
      ]
    }
  ],
  "reasoning": "Centered layout with a single block containing the Card form — perfect for login screens."
}

User: "a todo app"
{
  "layout": "single-column",
  "blocks": [
    {
      "id": "todo-nav",
      "description": "Top navigation bar for the Todo app",
      "components": [
        { "type": "Navbar", "props": { "brand": "✅ TaskFlow", "items": [], "actions": [{"label": "Sign Out", "variant": "ghost"}] } }
      ]
    },
    {
      "id": "todo-main",
      "description": "Main task list card with input and tasks table",
      "components": [
        {
          "type": "Card",
          "props": { "title": "📝 My Tasks", "subtitle": "3 tasks remaining today" },
          "children": [
            { "type": "Input", "props": { "label": "", "placeholder": "Add a new task and press Enter..." } },
            { "type": "Divider", "props": {} },
            { "type": "Table", "props": {
              "columns": [{"key":"task","header":"Task"},{"key":"priority","header":"Priority"},{"key":"due","header":"Due"},{"key":"status","header":"Status"}],
              "data": [
                {"task":"Finish project proposal","priority":"🔴 High","due":"Today","status":"In Progress"},
                {"task":"Review pull requests","priority":"🟡 Medium","due":"Tomorrow","status":"Pending"},
                {"task":"Update documentation","priority":"🟢 Low","due":"Fri","status":"Pending"},
                {"task":"Deploy to production","priority":"🔴 High","due":"Today","status":"Done"},
                {"task":"Team standup meeting","priority":"🟡 Medium","due":"Daily","status":"Done"}
              ],
              "striped": true
            }}
          ]
        }
      ]
    }
  ],
  "reasoning": "Single-column layout with a Navbar block and a main task list block."
}

User: "analytics dashboard for e-commerce"
{
  "layout": "dashboard",
  "blocks": [
    {
      "id": "dash-nav",
      "description": "Top navbar with shop branding and export action",
      "components": [
        { "type": "Navbar", "props": { "brand": "🛒 ShopMetrics", "items": [{"label":"Overview","href":"#"},{"label":"Orders","href":"#"},{"label":"Customers","href":"#"}], "actions": [{"label":"📊 Export","variant":"secondary"}] } }
      ]
    },
    {
      "id": "dash-stats",
      "description": "Top row of key metric stat cards",
      "components": [
        { "type": "Stat", "props": { "label": "Total Revenue", "value": "$48,295", "trend": "+18.2%", "icon": "💰", "subtitle": "vs last month" } },
        { "type": "Stat", "props": { "label": "Orders", "value": "1,284", "trend": "+9.4%", "icon": "📦", "subtitle": "this month" } },
        { "type": "Stat", "props": { "label": "Avg Order Value", "value": "$37.60", "trend": "+4.1%", "icon": "🧾", "subtitle": "per order" } }
      ]
    },
    {
      "id": "dash-charts",
      "description": "Revenue trend and top products block",
      "components": [
        { "type": "Card", "props": { "title": "📈 Revenue Trend", "subtitle": "Last 6 months" }, "children": [
          { "type": "Chart", "props": { "type": "line", "title": "Monthly Revenue", "height": 260, "data": [
            {"label":"Aug","value":32000},{"label":"Sep","value":38000},{"label":"Oct","value":41000},{"label":"Nov","value":36000},{"label":"Dec","value":52000},{"label":"Jan","value":48295}
          ]}}
        ]},
        { "type": "Card", "props": { "title": "🏆 Top Products", "subtitle": "Best sellers this month" }, "children": [
          { "type": "Table", "props": { "columns": [{"key":"product","header":"Product"},{"key":"units","header":"Units"},{"key":"revenue","header":"Revenue"},{"key":"status","header":"Status"}], "striped": true, "data": [
            {"product":"AirPods Pro","units":"428","revenue":"$42,800","status":"In Stock"},
            {"product":"iPhone Case","units":"389","revenue":"$11,670","status":"In Stock"},
            {"product":"USB-C Hub","units":"312","revenue":"$15,600","status":"Low Stock"},
            {"product":"MagSafe Wallet","units":"287","revenue":"$11,480","status":"In Stock"},
            {"product":"Smart Watch Band","units":"201","revenue":"$6,030","status":"Out of Stock"}
          ]}}
        ]}
      ]
    }
  ],
  "reasoning": "Dashboard layout with grouped blocks for navigation, stats grid, and charts."
}`;

// ---- PLANNER FUNCTION ----

export async function runPlanner(userPrompt: string): Promise<PlannerOutput> {
  const userMessage = `User wants: "${userPrompt}"

Create the best component plan to build exactly what they asked for.
- Choose the layout that fits the request (see the layout selection guide in your system prompt)
- Match the complexity to the request (simple requests = fewer components)
- Use realistic sample data
- Output ONLY the JSON plan, no other text.`;

  const response = await callGemini(userMessage, PLANNER_SYSTEM_PROMPT);

  let cleanResponse = response.trim();
  if (cleanResponse.startsWith('`')) {
    cleanResponse = cleanResponse.replace(/^`{3}(?:json)?\s*\n?/, '').replace(/\n?`{3}\s*$/, '');
  }

  try {
    const plan: PlannerOutput = JSON.parse(cleanResponse);

    if (!plan.layout || !plan.blocks || !Array.isArray(plan.blocks)) {
      throw new Error('Invalid plan structure: missing layout or blocks array');
    }

    const validLayouts = ['single-column', 'two-column', 'sidebar-layout', 'dashboard', 'centered', 'full-width', 'landing-page', 'form-page', 'app-shell'];
    if (!validLayouts.includes(plan.layout)) {
      plan.layout = 'single-column';
    }

    if (!plan.reasoning) {
      plan.reasoning = 'Plan generated based on user intent.';
    }

    return plan;
  } catch (error) {
    console.error('[Planner] JSON parse error:', error);
    console.error('[Planner] Raw response:', cleanResponse);

    // Fallback plan
    return {
      layout: 'single-column',
      blocks: [
        {
          id: 'error-block',
          description: 'Error fallback block',
          components: [
            {
              type: 'Card',
              props: { title: '⚠️ Generation Failed', subtitle: 'Could not parse the plan — try a different prompt' },
              children: [{ type: 'Button', props: { variant: 'primary' }, children: ['Try Again'] }],
            },
          ]
        }
      ],
      reasoning: 'Fallback: JSON parse error from planner response.',
    };
  }
}