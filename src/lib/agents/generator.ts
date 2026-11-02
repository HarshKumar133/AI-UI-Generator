// ============================================
// AGENT STEP 2: GENERATOR
// Converts the structured plan into React UI code
// Uses allowed components + HTML layout tags
// ============================================

import {
  PlannerOutput,
  GeneratorOutput,
  ComponentType,
  PlannerBlock,
  GenerationEvent,
  GenerationMode,
  GenerationTarget,
  PreviewArtifact,
} from '@/types';
import { callGemini } from './geminiClient';
import { getComponentDescriptions } from '../validation';

// ---- ALL ALLOWED COMPONENT TYPES ----

const ALL_COMPONENTS: ComponentType[] = [
  'Button', 'Card', 'Input', 'Table', 'Modal', 'Sidebar', 'Navbar',
  'Chart', 'Badge', 'Avatar', 'Progress', 'Stat', 'Alert', 'Toggle',
  'Tabs', 'Divider', 'Select',
];

export interface GeneratorRunOptions {
  mode?: GenerationMode;
  target?: GenerationTarget;
  userPrompt?: string;
}

// ---- PEAK-QUALITY PROMPT TEMPLATE ----

const GENERATOR_SYSTEM_PROMPT = `You are the GENERATOR agent. Your output becomes real code rendered live in a browser preview panel.

MISSION: Generate a polished, distinctive, production-quality React/TSX UI tailored to the user's actual product and audience. Surprise and delight through excellent art direction, composition, typography, and detail—not a one-size-fits-all template.

════════════════════════
STRICT IMPORT RULES
════════════════════════
- First line: 'use client';
- Import components ONLY from '@/components/ui':
  Button, Card, Input, Table, Modal, Sidebar, Navbar, Chart, Badge, Avatar, Progress, Stat, Alert, Toggle, Tabs, Divider, Select
- React hooks (useState, useCallback, useRef) from 'react' are allowed
- NO external libraries whatsoever
- Component name: GeneratedUI, default export

${getComponentDescriptions()}

════════════════════════
PREMIUM DESIGN MANDATES
════════════════════════

1. ART DIRECTION — Read the request and choose a distinctive visual concept for this product and audience. Establish a memorable focal point, confident type scale, deliberate negative space, and concise palette. Avoid default dashboard/card-grid compositions unless the product truly calls for them; vary layouts with editorial structure, asymmetry, layered sections, or immersive hero treatments where appropriate.

2. TYPOGRAPHY — Make headings expressive and legible. Gradient text is optional; use solid color when it creates a more refined hierarchy:
   style={{ background: 'linear-gradient(135deg, #15120f 0%, #da4f2f 65%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', margin: 0 }}

3. ATMOSPHERE — Give the page a deliberate background treatment; layered radial gradients are one option, not a required brand style:
   style={{ minHeight: '100vh', background: 'radial-gradient(ellipse at 15% 10%, rgba(218,79,47,0.1) 0%, transparent 45%), radial-gradient(ellipse at 85% 80%, rgba(240,122,96,0.08) 0%, transparent 40%), #fffdf9' }}

4. SURFACES — Use cards, glass, borders, and shadows selectively to build hierarchy; do not wrap every section in the same card:
   style={{ background: 'rgba(255,255,255,0.9)', border: '1px solid rgba(21,18,15,0.12)', borderRadius: 24, backdropFilter: 'blur(12px)' }}

5. INTERACTION POLISH — Add a small number of purposeful hover/focus states with lightweight transitions. Do not add state or animation to every card; never make input wait on animation:
   const [h, setH] = React.useState(false);
   style={{ transform: h ? 'translateY(-5px) scale(1.015)' : 'none', transition: 'all 280ms cubic-bezier(0.34, 1.56, 0.64, 1)', boxShadow: h ? '0 24px 60px rgba(65,43,24,0.18), 0 0 0 1px rgba(218,79,47,0.16)' : '0 2px 12px rgba(65,43,24,0.1)' }}

6. CONTENT — Use specific, realistic content rather than lorem ipsum or generic placeholders. Match the amount of data to the screen; do not add unrelated widgets just to fill space:
   - Months: Jan–Dec, realistic numbers (revenue $120k–$500k, users 10k–200k)
   - Table rows: 5+ rows, each with 4+ columns of realistic data
   - Charts: 6-8 data points minimum with actual month/day labels

7. TYPE SCALE:
   - h1: fontSize '3rem+', fontWeight 900, letterSpacing '-0.04em', lineHeight 1.05
   - h2: fontSize '1.8rem', fontWeight 800, letterSpacing '-0.03em'
   - Subtitles: fontSize '1.1rem', color '#5d544b', lineHeight 1.65
   - Labels: fontSize '0.72rem', fontWeight 700, letterSpacing '0.06em', textTransform 'uppercase', color '#8a7e72'

8. ACCESSIBILITY & RESPONSIVENESS:
   - Add descriptive 'aria-label' to icon-only buttons and elements without visible text.
   - Ensure layout structural components use semantic roles.
   - Reflow without horizontal overflow using flexible widths, minmax()/auto-fit grids, wrapping rows, and clamped spacing. Avoid fixed-width panels and fixed-height page shells.
   - Keep input responsive; prefer transform/opacity motion and respect reduced-motion preferences where practical.

9. ICONOGRAPHY — Keep a consistent icon style; emoji are optional and should be used sparingly and intentionally.

════════════════════════
COMPLETE PREMIUM EXAMPLE — Analytics Dashboard
════════════════════════
This example demonstrates implementation completeness only. Do not copy its palette, gradients, emoji density, or dashboard composition unless those choices genuinely fit the user's request.
\`\`\`tsx
'use client';
import React from 'react';
import { Navbar, Sidebar, Stat, Chart, Table, Badge, Card, Button, Progress, Avatar } from '@/components/ui';

export default function GeneratedUI() {
  const [activeItem, setActiveItem] = React.useState('overview');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: 'radial-gradient(ellipse at 10% 5%, rgba(218,79,47,0.09) 0%, transparent 40%), radial-gradient(ellipse at 90% 90%, rgba(240,122,96,0.07) 0%, transparent 35%), #fffdf9', color: '#15120f', fontFamily: "'Inter', system-ui, sans-serif", overflow: 'hidden' }}>
      <Navbar brand="⚡ Pulse" items={[{ label: 'Overview', href: '#' }, { label: 'Revenue', href: '#' }, { label: 'Users', href: '#' }, { label: 'Reports', href: '#' }]} actions={[{ label: 'Export CSV', variant: 'ghost' }, { label: '✦ Upgrade', variant: 'primary' }]} />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Sidebar width={230} title="WORKSPACE" groups={[
          { label: 'Analytics', items: [
            { id: 'overview', label: 'Overview', icon: '📊', active: activeItem === 'overview' },
            { id: 'revenue', label: 'Revenue', icon: '💰', active: activeItem === 'revenue' },
            { id: 'users', label: 'Users', icon: '👥', active: activeItem === 'users' },
            { id: 'funnel', label: 'Funnel', icon: '🎯', active: activeItem === 'funnel' },
          ]},
          { label: 'Manage', items: [
            { id: 'integrations', label: 'Integrations', icon: '🔗' },
            { id: 'billing', label: 'Billing', icon: '💳' },
            { id: 'settings', label: 'Settings', icon: '⚙️' },
          ]},
        ]} />
        <main style={{ flex: 1, overflowY: 'auto', padding: '28px 36px', display: 'flex', flexDirection: 'column', gap: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h1 style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '-0.04em', background: 'linear-gradient(135deg, #15120f 20%, #da4f2f 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', margin: 0 }}>Business Overview</h1>
              <p style={{ color: '#8a7e72', fontSize: '0.82rem', marginTop: 4 }}>Last updated: Feb 22, 2026, 10:14 AM · All regions</p>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <Badge variant="success" dot>● Live</Badge>
              <Badge variant="info">Feb 2026</Badge>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {[
              { label: 'Monthly Revenue', value: '$284,920', trend: '+18.4%', icon: '💰', subtitle: 'vs $240.5k last mo.' },
              { label: 'Active Users', value: '48,291', trend: '+12.7%', icon: '👥', subtitle: 'DAU/MAU ratio: 68%' },
              { label: 'Conversion Rate', value: '4.82%', trend: '+0.9%', icon: '🎯', subtitle: 'Landing → Trial' },
              { label: 'Avg Session', value: '8m 43s', trend: '-0.2%', icon: '⏱', subtitle: 'Bounce rate: 22%' },
            ].map((kpi, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.92)', border: '1px solid rgba(21,18,15,0.12)', borderRadius: 20, padding: '22px 24px' }}>
                <Stat label={kpi.label} value={kpi.value} trend={kpi.trend} icon={kpi.icon} subtitle={kpi.subtitle} />
              </div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
            <Card title="📈 MRR Growth" subtitle="Monthly recurring revenue — Jan to Aug 2025">
              <Chart type="line" height={210} data={[{ label: 'Jan', value: 195000 }, { label: 'Feb', value: 214000 }, { label: 'Mar', value: 228600 }, { label: 'Apr', value: 241200 }, { label: 'May', value: 255800 }, { label: 'Jun', value: 269400 }, { label: 'Jul', value: 284920 }, { label: 'Aug', value: 301000 }]} />
            </Card>
            <Card title="🥧 Traffic Mix" subtitle="Channel breakdown, Feb 2026">
              <Chart type="pie" height={200} data={[{ label: 'Organic', value: 42 }, { label: 'Paid', value: 28 }, { label: 'Referral', value: 18 }, { label: 'Direct', value: 12 }]} />
            </Card>
          </div>
          <Card title="🏆 Top Plans" subtitle="Revenue by product tier, Feb 2026" headerAction={<Button variant="ghost" size="sm">View All →</Button>}>
            <Table striped columns={[{ key: 'plan', header: 'Plan' }, { key: 'mrr', header: 'MRR' }, { key: 'accounts', header: 'Accounts' }, { key: 'churn', header: 'Churn' }, { key: 'status', header: 'Status' }]}
              data={[
                { plan: '🏢 Enterprise', mrr: '$142,400', accounts: '1,240', churn: '0.8%', status: '✅ Stable' },
                { plan: '⚡ Pro', mrr: '$89,200', accounts: '4,820', churn: '2.1%', status: '✅ Stable' },
                { plan: '🌱 Starter', mrr: '$32,100', accounts: '12,940', churn: '5.4%', status: '⚠ Watch' },
                { plan: '📊 Analytics Add-on', mrr: '$14,800', accounts: '2,110', churn: '1.2%', status: '✅ Stable' },
                { plan: '🤖 AI Add-on', mrr: '$6,420', accounts: '890', churn: '0.4%', status: '🔬 Beta' },
              ]} />
          </Card>
        </main>
      </div>
    </div>
  );
}
\`\`\`

════════════════════════
LAYOUT GUIDANCE
════════════════════════

LANDING PAGE — "landing-page" layout:
- Choose a visual concept, palette, and hero composition that fit the product; centered gradient headlines and glow orbs are optional, not defaults.
- Make the first viewport complete with one clear message, useful CTA(s), and strong visual hierarchy.
- Choose a distinctive feature presentation (editorial split, showcase, timeline, bento, or compact grid) rather than always using three cards.
- Add a bottom CTA only when it supports the story; keep backgrounds and motion subtle and performant.
- Example glow orb, if it genuinely suits the design:
  <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)', width: 600, height: 600, background: 'radial-gradient(circle, rgba(218,79,47,0.14) 0%, transparent 70%)', pointerEvents: 'none', borderRadius: '50%' }} />

LOGIN / SIGNUP — "centered" layout:
- Root: focused, responsive composition with a palette suited to the product.
- Keep the form easy to scan, with comfortable touch targets and visible focus states.
- Add social auth only when requested or clearly appropriate; don't invent providers.
- Micro-copy beneath form: "By continuing you agree to our Terms"

TODO / INTERACTIVE — "single-column" layout:
- Use React.useState for items: const [items, setItems] = React.useState([...])
- Seed a small number of plausible tasks only when useful; never use generic placeholder text.
- Add: Input + Button row at top; Check + Delete per item
- Completed items: opacity 0.4, textDecoration: 'line-through'
- Use a clear, helpful empty state; emoji are optional.

SETTINGS — "two-column" layout:
- Left nav: concise category navigation with a consistent icon treatment only if useful.
- Right: group related preferences with clear labels and descriptions; don't put every setting in an identical card.
- Save Button at bottom-right with success Alert on save

CLOCK / TIME DISPLAY:
- Make current time the clear visual hero, with large, high-contrast digits in stable-width cells.
- Update from the real clock every second and honor requested 12/24-hour format and timezone.
- Do not add weather, calendar, alarm, or settings widgets unless asked; keep them secondary when requested.
- Use a distinctive, product-appropriate digital design language and ensure digits are visible on first render.

OUTPUT FORMAT:
Return ONLY valid TSX code.
Start with: 'use client';
No markdown fences. No extra explanation. Just code.`;

const CREATIVE_WEB_GENERATOR_SYSTEM_PROMPT = `You are a senior UI/UX engineer building premium SaaS web experiences.

Your output is production-ready Next.js/React TSX code.

Rules:
- Output ONLY TSX code (no markdown, no fences).
- First line: 'use client';
- Default export must be function GeneratedUI.
- You may use any appropriate UI/UX libraries (animation, charts, forms, data viz, etc), but prefer React-native implementation patterns that run without extra package installation for baseline preview compatibility.
- Keep imports explicit and valid when used.
- Prefer composable patterns and modern responsive layout.
- Include thoughtful motion/interaction states (hover, loading, transitions).
- Prioritize accessibility and keyboard/semantic correctness.
- Build responsive layouts that reflow cleanly on mobile, tablet, and desktop; keep controls usable and interactions snappy.

Design baseline:
- Choose a clear visual concept that fits the request. Make each screen feel art-directed and memorable, with a strong focal point, deliberate composition, distinctive typography, and a restrained color system.
- Use layered surfaces, lighting, texture, gradients, and motion with purpose. Avoid default white cards on a blank background, generic admin templates, repetitive card grids, and decorative clutter.
- Make the first viewport feel complete and polished. Use realistic content, meaningful empty states, and specific visual details that make the product feel real.
- Keep contrast, type size, spacing, and responsive behavior strong enough that the design remains clear and usable at every viewport.
- Motion should feel refined and lightweight; never block input, run endless layout-heavy animation, or make controls feel unresponsive.

Deterministic output guardrails:
- The generated output is checked against a runtime JSON Schema contract and parsed as an AST before it can be previewed.
- Return syntactically valid TSX with one default-exported UI component. Keep imports explicit and use APIs that exist in the named packages.
- Avoid eval, innerHTML, dangerouslySetInnerHTML, and direct document.write. Prefer React state, semantic elements, and inline styles or CSS classes.

Clock, watch, and time-display requests:
- Make the live time the clear visual hero, with large, high-contrast, tabular numerals that are readable immediately on first render.
- Update the displayed time from the real clock every second and format it according to the requested 12-hour/24-hour preference and timezone.
- Use a distinctive digital design language (for example a deep midnight surface, restrained neon accents, crisp separators, and subtle motion) instead of a generic white card.
- Do not add weather, calendar, alarm, or settings widgets unless the prompt asks for them; if requested, keep them secondary to the clock.
- Keep digit layout stable: every digit slot must reserve a visible width. Never place all digit text absolutely inside a zero-width inline container; prefer tabular numerals or a grid with fixed-width cells.
- Ensure the initial render contains real digits, not blank placeholders, dots, or an animation-only state.
`;

const CREATIVE_EXPO_GENERATOR_SYSTEM_PROMPT = `You are a senior React Native + Expo product designer and app engineer.

Generate a high-quality mobile app code bundle for Android/iOS using Expo.

Rules:
- Output plain text code only, no markdown fences.
- Use this exact multi-file format:
  // FILE: App.tsx
  ...code...
  // FILE: screens/HomeScreen.tsx
  ...code...
- Include at least App.tsx and 2 additional files (screens/components).
- Use Expo-friendly libraries when needed (expo-router optional, react-native-reanimated optional, etc).
- Give the app a distinctive visual concept, refined typography/color, and a memorable first screen; avoid generic repeated-card layouts.
- Use mobile-first composition, ergonomic touch targets, and realistic navigation patterns.
- Add lightweight, purposeful motion without blocking input or slowing interactions.
- Keep content specific, UX-focused, and implementation-ready.
`;

// ---- SYSTEM PROMPT FOR INDIVIDUAL BLOCKS ----

const BLOCK_GENERATOR_SYSTEM_PROMPT = `You are a UI BLOCK GENERATOR agent. Your job is to strictly build ONE piece of a larger UI.

MISSION: Generate a polished, production-quality React TSX block with clear art direction that fits its description and the surrounding product. Make it memorable through composition, typography, color, and precise details—not decoration for decoration's sake.

════════════════════════
STRICT IMPORT RULES
════════════════════════
- Import components ONLY from '@/components/ui':
  Button, Card, Input, Table, Modal, Sidebar, Navbar, Chart, Badge, Avatar, Progress, Stat, Alert, Toggle, Tabs, Divider, Select
- React hooks (useState, useCallback, useRef) from 'react' are allowed
- NO external libraries whatsoever
- Component name MUST match the provided Block ID in PascalCase (e.g. "SidebarBlock")
- Must export default

${getComponentDescriptions()}

════════════════════════
PREMIUM DESIGN MANDATES
════════════════════════
1. Choose an intentional palette and hierarchy suited to the product; avoid repetitive card stacks and generic dashboard styling.
2. Use surfaces, borders, shadows, gradients, or texture selectively to emphasize important content.
3. Keep content realistic and specific without adding filler or unrelated widgets.
4. Build responsive flex/grid layouts that shrink and wrap cleanly; avoid fixed widths and horizontal overflow.
5. Use semantic markup, visible focus states, accessible names, and a small number of lightweight interactions. Emojis and animation are optional, never mandatory.

OUTPUT FORMAT:
Return ONLY valid TSX valid.
Do NOT start with 'use client';! Just output the function.
No markdown fences. No extra text. Just code.`;

// ---- SYSTEM PROMPT FOR SHELL (LAYOUT) ----
const SHELL_GENERATOR_SYSTEM_PROMPT = `You are the SHELL GENERATOR agent. Your job is to arrange existing React component blocks into a polished, memorable page.

MISSION: Create the master layout shell that stitches the blocks together seamlessly.

════════════════════════
STRICT IMPORT RULES
════════════════════════
- First line MUST be: 'use client';
- Import components ONLY from '@/components/ui' IF NEEDED for layout scaffolding (rare).
- The blocks will be injected into this file during build time, so ASSUME they exist and just call them by their PascalCase names (e.g., <SidebarBlock />, <NavbarBlock />).
- Component name: GeneratedUI, default export

════════════════════════
PREMIUM DESIGN MANDATES
════════════════════════
1. Establish a clear visual hierarchy and a page background/palette that suits the request; do not default to the warm orange sample style.
2. Create deliberate composition with useful spacing, a clear focal point, and varied section treatments; avoid making every block look like the same card.
3. Handle flex/grid alignment responsively, allow content to scroll naturally, and prevent fixed-width layouts or horizontal overflow.
4. Keep navigation and controls accessible and interactive without blocking input.

OUTPUT FORMAT:
Return ONLY valid TSX valid.
Start with: 'use client';
No markdown fences. Just code.`;

// ---- GENERATOR FUNCTIONS ----

export async function runBlockGenerator(block: PlannerBlock, layout: string, onEvent?: (e: GenerationEvent) => void): Promise<{ code: string; components: ComponentType[] }> {
  if (onEvent) onEvent({ type: 'agent_start', agentId: block.id, agentName: `Block: ${block.id}`, message: `Starting generation for ${block.id}...` });

  const pascalName = block.id.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join('') + 'Block';

  const userMessage = `Build this specific block: ${pascalName}

DESCRIPTION: ${block.description}

COMPONENTS TO USE (Must use all):
${JSON.stringify(block.components, null, 2)}

REQUIREMENTS:
1. Component name MUST be: ${pascalName} (default export)
2. Use realistic, specific content matching the description, without filler.
3. Apply premium design mandates.
4. Return ONLY React TSX code. NO 'use client' header. No markdown.`;

  const response = await callGemini(userMessage, BLOCK_GENERATOR_SYSTEM_PROMPT);

  let code = response.trim();
  if (code.startsWith('`')) {
    code = code.replace(/^`{3}(?:tsx?|jsx?|typescript|javascript)?\s*\n?/, '').replace(/\n?`{3}\s*$/, '');
  }

  // Ensure React import exists
  if (!code.includes("from 'react'") && !code.includes('from "react"')) {
    code = `import React from 'react';\n${code}`;
  }

  // Ensure UI import exists
  if (!code.includes("from '@/components/ui'") && !code.includes('from "@/components/ui"')) {
    const usedComponents = extractUsedComponents(code);
    if (usedComponents.length > 0) {
      const importLine = `import { ${usedComponents.join(', ')} } from '@/components/ui';\n`;
      code = importLine + code;
    }
  }

  if (onEvent) onEvent({ type: 'agent_done', agentId: block.id, agentName: `Block: ${block.id}`, message: `Finished ${block.id} generation` });

  return { code, components: extractUsedComponents(code) };
}

export async function runShellGenerator(plan: PlannerOutput, blockNames: string[], onEvent?: (e: GenerationEvent) => void): Promise<string> {
  if (onEvent) onEvent({ type: 'agent_start', agentId: 'shell', agentName: 'Layout Shell', message: 'Stitching blocks together...' });

  const userMessage = `Create the master GeneratedUI layout shell.

PAGE LAYOUT TYPE: "${plan.layout}"
REASONING: ${plan.reasoning}

AVAILABLE BLOCKS TO RENDER:
${blockNames.join(', ')}

REQUIREMENTS:
1. First line: 'use client';
2. Component Name: GeneratedUI (default export)
3. Arrange all the available blocks properly using flex/grid.
4. Give the root container a cohesive background suited to the design brief.
5. Render ALL available blocks exactly as named (e.g. <SidebarBlock />). 
6. Return ONLY React TSX code. No markdown fences.
${getLayoutGuidance(plan.layout)}`;

  const response = await callGemini(userMessage, SHELL_GENERATOR_SYSTEM_PROMPT);

  let code = response.trim();
  if (code.startsWith('`')) {
    code = code.replace(/^`{3}(?:tsx?|jsx?|typescript|javascript)?\s*\n?/, '').replace(/\n?`{3}\s*$/, '');
  }

  if (!code.startsWith("'use client'") && !code.startsWith('"use client"')) {
    code = `'use client';\n${code}`;
  }

  if (onEvent) onEvent({ type: 'agent_done', agentId: 'shell', agentName: 'Layout Shell', message: 'Finished laying out the shell' });

  return code;
}

export async function runGenerator(
  plan: PlannerOutput,
  onEvent?: (e: GenerationEvent) => void,
  options: GeneratorRunOptions = {}
): Promise<GeneratorOutput> {
  const mode = options.mode ?? 'creative';
  const target = options.target ?? plan.target ?? 'web';
  const userPrompt = options.userPrompt;

  if (mode === 'deterministic') {
    return runDeterministicGenerator(plan, onEvent);
  }

  return runCreativeGenerator(plan, target, userPrompt, onEvent);
}

export async function repairGeneratedCode(
  candidate: string,
  diagnostics: string,
  options: { mode: GenerationMode; target: GenerationTarget; userPrompt?: string }
): Promise<string> {
  const { mode, target, userPrompt } = options;
  const systemPrompt = target === 'expo-rn'
    ? CREATIVE_EXPO_GENERATOR_SYSTEM_PROMPT
    : mode === 'deterministic'
      ? GENERATOR_SYSTEM_PROMPT
      : CREATIVE_WEB_GENERATOR_SYSTEM_PROMPT;
  const format = target === 'expo-rn'
    ? 'a complete Expo bundle using // FILE: path markers, including App.tsx'
    : 'a complete TSX file with a default-exported GeneratedUI component';
  const userMessage = `Repair the generated implementation so it passes the required schema and syntax parser.

Original request: ${userPrompt || 'Build the planned application'}
Target: ${target}
Required output: ${format}

Exact validation/compiler diagnostics from the previous attempt (preserve these verbatim while reasoning about the fix):
${diagnostics}

Previous candidate:
\`\`\`tsx
${candidate}
\`\`\`

Return the complete corrected implementation, not a patch. Fix every reported diagnostic while preserving the intended design and functionality. Do not add fallback blank screens or omit parts of the app. Output code only.`;
  const response = await callGemini(userMessage, systemPrompt);
  const normalized = stripCodeFences(response);
  return target === 'expo-rn'
    ? ensureExpoBundleShape(normalized)
    : ensureGeneratedUIExports(normalized, 'tsx');
}

async function runDeterministicGenerator(plan: PlannerOutput, onEvent?: (e: GenerationEvent) => void): Promise<GeneratorOutput> {
  if (!plan.blocks || plan.blocks.length === 0) {
    throw new Error('Plan has no blocks');
  }

  const blockResults = await Promise.all(
    plan.blocks.map((block) => runBlockGenerator(block, plan.layout, onEvent))
  );

  const blockNames = plan.blocks.map((b) => b.id.split('-').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join('') + 'Block');
  const shellCode = await runShellGenerator(plan, blockNames, onEvent);

  let finalCode = shellCode;
  const allUsedComponents = new Set<ComponentType>();
  extractUsedComponents(shellCode).forEach((c) => allUsedComponents.add(c));

  const blockCodes = blockResults.map((r, i) => {
    r.components.forEach((c) => allUsedComponents.add(c));
    let cleanBlock = r.code
      .replace(/['"`]?use client['"`]?;?\n?/ig, '')
      .replace(/export default [A-Za-z0-9_]+;?\n?/g, '')
      .replace(/import {[^}]+} from ['"]@\/components\/ui['"];?\n?/g, '')
      .replace(/import React[^;]+;?\n?/g, '');
    cleanBlock = normalizeBlockDeclaration(cleanBlock, blockNames[i]);
    return `// --- Block: ${blockNames[i]} ---\n${cleanBlock}`;
  });

  const importLine = allUsedComponents.size > 0
    ? `import { ${Array.from(allUsedComponents).join(', ')} } from '@/components/ui';\n`
    : '';

  finalCode = finalCode.replace(/import {[^}]+} from ['"]@\/components\/ui['"];?\n?/g, '');
  finalCode = finalCode.replace(/['"`]?use client['"`]?;?\n?/ig, '');
  finalCode = finalCode.replace(/import React[^;]*;?\n?/g, '');
  finalCode = `'use client';\n// @ts-nocheck\nimport React from 'react';\n${importLine}\n${finalCode.trim()}`;

  const exportMatch = finalCode.match(/export default function GeneratedUI/);
  if (exportMatch && exportMatch.index !== undefined) {
    finalCode = finalCode.slice(0, exportMatch.index) + '\n\n' + blockCodes.join('\n\n') + '\n\n' + finalCode.slice(exportMatch.index);
  } else {
    finalCode += '\n\n' + blockCodes.join('\n\n');
  }

  return {
    code: finalCode,
    primaryCode: finalCode,
    componentList: Array.from(allUsedComponents),
    metadata: {
      mode: 'deterministic',
      target: 'web',
      runtime: 'nextjs',
      selectedLibraries: ['react', '@/components/ui'],
    },
  };
}

async function runCreativeGenerator(
  plan: PlannerOutput,
  target: GenerationTarget,
  userPrompt: string | undefined,
  onEvent?: (e: GenerationEvent) => void
): Promise<GeneratorOutput> {
  if (onEvent) {
    onEvent({
      type: 'agent_start',
      agentId: 'creative-generator',
      agentName: 'Creative Generator',
      message: `Generating ${target === 'expo-rn' ? 'Expo React Native' : 'web'} implementation...`,
    });
  }

  const primaryCode = target === 'expo-rn'
    ? await generateCreativeExpoCode(plan, userPrompt)
    : await generateCreativeWebCode(plan, userPrompt);

  const selectedLibraries = extractImportSources(primaryCode);
  const metadata = {
    mode: 'creative' as const,
    target,
    runtime: target === 'expo-rn' ? ('expo-rn' as const) : ('nextjs' as const),
    selectedLibraries,
  };

  const previewArtifact = target === 'expo-rn' ? buildExpoPreviewArtifact(plan, selectedLibraries) : undefined;

  if (onEvent) {
    onEvent({
      type: 'agent_done',
      agentId: 'creative-generator',
      agentName: 'Creative Generator',
      message: `Generated ${target === 'expo-rn' ? 'Expo bundle + mobile preview artifact' : 'web app code'}`,
    });
  }

  return {
    code: primaryCode,
    primaryCode,
    componentList: selectedLibraries,
    previewArtifact,
    metadata,
  };
}

async function generateCreativeWebCode(plan: PlannerOutput, userPrompt?: string): Promise<string> {
  const userMessage = `Build the app described by this creative plan.

Target: web
Original user request: ${userPrompt || 'N/A'}
Layout hint: ${plan.layout}
Reasoning: ${plan.reasoning}
Design brief: ${plan.designBrief || 'Premium SaaS product experience'}
Wireframe plan:
${(plan.wireframePlan || []).map((line, i) => `${i + 1}. ${line}`).join('\n') || '- Build a polished app shell with clear hierarchy'}
Motion plan:
${(plan.motionPlan || []).map((line, i) => `${i + 1}. ${line}`).join('\n') || '- Add meaningful micro-interactions'}
Library plan:
${(plan.libraryPlan || []).map((lib) => `- ${lib.name}: ${lib.reason}`).join('\n') || '- choose best-fit libraries'}
Implementation plan:
${(plan.implementationPlan || []).map((line, i) => `${i + 1}. ${line}`).join('\n') || '- build production-ready UI'}

Preview compatibility requirement:
- Prefer implementation that runs with React + local code without requiring package installs.

Output only TSX code for GeneratedUI.`;

  const response = await callGemini(userMessage, CREATIVE_WEB_GENERATOR_SYSTEM_PROMPT);
  const code = stripCodeFences(response);
  return ensureGeneratedUIExports(code, 'tsx');
}

async function generateCreativeExpoCode(plan: PlannerOutput, userPrompt?: string): Promise<string> {
  const userMessage = `Build an Expo React Native code bundle from this plan.

Target: expo-rn
Original user request: ${userPrompt || 'N/A'}
Reasoning: ${plan.reasoning}
Design brief: ${plan.designBrief || 'Premium SaaS mobile app'}
Wireframe plan:
${(plan.wireframePlan || []).map((line, i) => `${i + 1}. ${line}`).join('\n') || '- home screen + detail screen + settings screen'}
Motion plan:
${(plan.motionPlan || []).map((line, i) => `${i + 1}. ${line}`).join('\n') || '- animated transitions and button feedback'}
Library plan:
${(plan.libraryPlan || []).map((lib) => `- ${lib.name}: ${lib.reason}`).join('\n') || '- choose best-fit expo libraries'}
Implementation plan:
${(plan.implementationPlan || []).map((line, i) => `${i + 1}. ${line}`).join('\n') || '- create reusable components and screens'}

Output a multi-file bundle using // FILE: path markers.`;

  const response = await callGemini(userMessage, CREATIVE_EXPO_GENERATOR_SYSTEM_PROMPT);
  const code = stripCodeFences(response);
  return ensureExpoBundleShape(code);
}

function stripCodeFences(content: string): string {
  const trimmed = content.trim();
  if (!trimmed.startsWith('`')) {
    return trimmed;
  }
  return trimmed.replace(/^`{3}(?:tsx?|jsx?|typescript|javascript|json)?\s*\n?/, '').replace(/\n?`{3}\s*$/, '');
}

function ensureGeneratedUIExports(code: string, kind: 'tsx' | 'expo'): string {
  let normalized = code.trim();
  if (kind === 'tsx') {
    if (!normalized.startsWith("'use client'") && !normalized.startsWith('"use client"')) {
      normalized = `'use client';\n${normalized}`;
    }
    if (!/export\s+default\s+function\s+GeneratedUI|export\s+default\s+GeneratedUI/.test(normalized)) {
      if (/function\s+GeneratedUI\s*\(/.test(normalized)) {
        normalized = normalized.replace(/function\s+GeneratedUI\s*\(/, 'export default function GeneratedUI(');
      } else if (/\b(?:const|let|class)\s+GeneratedUI\b/.test(normalized)) {
        normalized += '\n\nexport default GeneratedUI;\n';
      }
    }
  }
  return normalized;
}

function ensureExpoBundleShape(code: string): string {
  let normalized = code.trim();
  if (!/^\/\/\s*FILE:/m.test(normalized)) {
    normalized = `// FILE: App.tsx\n${normalized}`;
  }
  return ensureGeneratedUIExports(normalized, 'expo');
}

function buildExpoPreviewArtifact(plan: PlannerOutput, selectedLibraries: string[]): PreviewArtifact {
  const wireframes = (plan.wireframePlan && plan.wireframePlan.length > 0)
    ? plan.wireframePlan
    : ['Home dashboard with summary cards', 'Details screen with list + filters', 'Settings and profile preferences'];
  const motions = (plan.motionPlan && plan.motionPlan.length > 0)
    ? plan.motionPlan
    : ['Screen fade/slide transition', 'Card lift interaction', 'Loading shimmer and success toast'];

  const wireframeItems = wireframes.slice(0, 5).map((item) => `<li>${escapeHtml(item)}</li>`).join('');
  const motionItems = motions.slice(0, 4).map((item) => `<li>${escapeHtml(item)}</li>`).join('');
  const libItems = selectedLibraries.length > 0
    ? selectedLibraries.slice(0, 6).map((item) => `<span class="chip">${escapeHtml(item)}</span>`).join('')
    : '<span class="chip">expo</span><span class="chip">react-native</span>';

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Expo Mobile Preview Artifact</title>
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      min-height: 100vh;
      display: grid;
      place-items: center;
      font-family: Inter, system-ui, -apple-system, Segoe UI, sans-serif;
      color: #15120f;
      background:
        radial-gradient(circle at 14% 12%, rgba(218,79,47,0.14), transparent 44%),
        radial-gradient(circle at 82% 88%, rgba(240,122,96,0.12), transparent 40%),
        #fffaf4;
      padding: 28px;
    }
    .frame {
      width: min(390px, 92vw);
      border-radius: 30px;
      padding: 14px;
      background: linear-gradient(180deg, #111 0%, #222 100%);
      box-shadow: 0 32px 70px rgba(39, 24, 14, 0.36);
    }
    .device {
      border-radius: 22px;
      overflow: hidden;
      background: #fffdf9;
      border: 1px solid rgba(21,18,15,0.12);
      min-height: 700px;
      position: relative;
    }
    .top {
      height: 54px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(250, 240, 231, 0.9);
      border-bottom: 1px solid rgba(21,18,15,0.08);
      font-weight: 700;
      letter-spacing: -0.02em;
      animation: fadeIn 420ms ease both;
    }
    .content {
      padding: 18px 16px 20px;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }
    .card {
      background: rgba(255,255,255,0.92);
      border: 1px solid rgba(21,18,15,0.1);
      border-radius: 14px;
      padding: 12px;
      box-shadow: 0 12px 22px rgba(65,43,24,0.08);
      animation: liftIn 520ms cubic-bezier(.2,.9,.2,1) both;
    }
    .card:nth-child(2) { animation-delay: 80ms; }
    .card:nth-child(3) { animation-delay: 140ms; }
    .label {
      font-size: 11px;
      color: #8a7e72;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      margin-bottom: 7px;
      font-weight: 700;
    }
    ul { margin: 0; padding-left: 18px; }
    li { margin: 0 0 6px; font-size: 13px; line-height: 1.45; color: #433d37; }
    .chips { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 6px; }
    .chip {
      font-size: 11px;
      font-weight: 700;
      padding: 5px 8px;
      border-radius: 999px;
      border: 1px solid rgba(218,79,47,0.26);
      background: rgba(218,79,47,0.08);
      color: #bf3f23;
    }
    .cta {
      margin-top: 8px;
      border: 1px solid rgba(218,79,47,0.25);
      background: linear-gradient(135deg, rgba(218,79,47,0.14), rgba(240,122,96,0.1));
      border-radius: 10px;
      padding: 9px 10px;
      font-size: 12px;
      color: #7a2f1d;
      font-weight: 700;
      text-align: center;
    }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(-10px);} to { opacity: 1; transform: translateY(0);} }
    @keyframes liftIn { from { opacity: 0; transform: translateY(18px) scale(0.98);} to { opacity: 1; transform: translateY(0) scale(1);} }
  </style>
</head>
<body>
  <div class="frame">
    <div class="device">
      <div class="top">📱 Expo Mobile Preview</div>
      <div class="content">
        <section class="card">
          <div class="label">Design Brief</div>
          <div style="font-size:13px; line-height:1.5; color:#433d37;">${escapeHtml(plan.designBrief || 'High-fidelity mobile SaaS app focused on UX clarity, motion, and responsive interactions.')}</div>
        </section>
        <section class="card">
          <div class="label">Wireframe Plan</div>
          <ul>${wireframeItems}</ul>
        </section>
        <section class="card">
          <div class="label">Motion Plan</div>
          <ul>${motionItems}</ul>
          <div class="chips">${libItems}</div>
          <div class="cta">Preview artifact mirrors generated Expo direction</div>
        </section>
      </div>
    </div>
  </div>
</body>
</html>`;

  return {
    kind: 'html',
    content: html,
    title: 'Expo Mobile Preview',
    description: 'Device mock preview for Expo React Native output',
  };
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function normalizeBlockDeclaration(code: string, expectedName: string): string {
  let normalized = code.trim();

  // Convert common "export default function X" shape into local declaration.
  normalized = normalized.replace(
    /export\s+default\s+function\s+[A-Za-z0-9_]+\s*\(/,
    `function ${expectedName}(`,
  );

  // Handle malformed model output like: "DashboardBlock() { ... }"
  normalized = normalized.replace(
    new RegExp(`^\\s*${expectedName}\\s*\\(`),
    `function ${expectedName}(`,
  );

  // If the block was emitted with a different PascalCase function name, rewrite the first declaration.
  const hasExpectedName = new RegExp(`\\b(function\\s+${expectedName}\\s*\\(|const\\s+${expectedName}\\s*=|let\\s+${expectedName}\\s*=|var\\s+${expectedName}\\s*=)`).test(normalized);
  if (!hasExpectedName) {
    normalized = normalized.replace(/^\s*([A-Z][A-Za-z0-9_]*)\s*\(/, `function ${expectedName}(`);
  }

  return normalized;
}

// ---- HELPER: Layout guidance ----

function getLayoutGuidance(layout: string): string {
  const guides: Record<string, string> = {
    'single-column': 'Use a readable, responsive content column with a distinctive hierarchy and appropriate density.',
    'two-column': 'Use responsive CSS grid; collapse to one column on narrow screens and keep the main content clear.',
    'sidebar-layout': 'Use responsive sidebar + scrollable main content; collapse or adapt navigation on narrow screens.',
    'dashboard': 'Build an information-rich but focused dashboard; show only relevant metrics and vary section composition.',
    'centered': 'Center the primary task or content with refined spacing; avoid a generic glow-card template.',
    'full-width': 'Use full-width sections with a product-specific hero and intentional composition.',
    'landing-page': 'Create a memorable hero and a distinctive product showcase; choose section layout to fit the story.',
    'form-page': 'Use a clear, responsive form layout with legible labels, visible focus, and a compact visual hierarchy.',
    'app-shell': 'Create a responsive application shell with accessible navigation and a naturally scrollable main area.',
  };
  return guides[layout] || guides['single-column'];
}

function extractImportSources(code: string): string[] {
  const regex = /^\s*import[\s\S]*?from\s+['"]([^'"]+)['"];?/gm;
  const sources = new Set<string>();
  let match: RegExpExecArray | null = null;

  while ((match = regex.exec(code)) !== null) {
    const source = match[1];
    if (source) {
      sources.add(source);
    }
  }

  if (sources.size === 0 && /react-native|expo/i.test(code)) {
    sources.add('react-native');
    sources.add('expo');
  }

  return Array.from(sources);
}

// ---- HELPER: Extract component names from code ----

function extractUsedComponents(code: string): ComponentType[] {
  const used: ComponentType[] = [];
  for (const comp of ALL_COMPONENTS) {
    const regex = new RegExp("<" + comp + "[\\\\s/>{]", "g");
    if (regex.test(code)) {
      used.push(comp);
    }
  }
  return used;
}
