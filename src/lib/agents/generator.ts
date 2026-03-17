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
}

// ---- PEAK-QUALITY PROMPT TEMPLATE ----

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const GENERATOR_SYSTEM_PROMPT = `You are the GENERATOR agent. Your output becomes real code rendered live in a browser preview panel.

MISSION: Generate STUNNING, PREMIUM, PRODUCTION-QUALITY React/TSX UI. Every output must look like it belongs on Dribbble or a funded startup's product. Surprise and delight — no basic UI.

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

1. GRADIENT TEXT — All h1/h2 must use gradient text:
   style={{ background: 'linear-gradient(135deg, #15120f 0%, #da4f2f 65%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', margin: 0 }}

2. AMBIENT BACKGROUND — Page root must have layered radial gradients:
   style={{ minHeight: '100vh', background: 'radial-gradient(ellipse at 15% 10%, rgba(218,79,47,0.1) 0%, transparent 45%), radial-gradient(ellipse at 85% 80%, rgba(240,122,96,0.08) 0%, transparent 40%), #fffdf9' }}

3. GLASS SURFACE CARDS — Key containers:
   style={{ background: 'rgba(255,255,255,0.9)', border: '1px solid rgba(21,18,15,0.12)', borderRadius: 24, backdropFilter: 'blur(12px)' }}

4. HOVER MICRO-ANIMATIONS — Every feature card MUST use:
   const [h, setH] = React.useState(false);
   style={{ transform: h ? 'translateY(-5px) scale(1.015)' : 'none', transition: 'all 280ms cubic-bezier(0.34, 1.56, 0.64, 1)', boxShadow: h ? '0 24px 60px rgba(65,43,24,0.18), 0 0 0 1px rgba(218,79,47,0.16)' : '0 2px 12px rgba(65,43,24,0.1)' }}

5. DENSE REAL DATA — No placeholder content. Real business-like data:
   - Months: Jan–Dec, realistic numbers (revenue $120k–$500k, users 10k–200k)
   - Table rows: 5+ rows, each with 4+ columns of realistic data
   - Charts: 6-8 data points minimum with actual month/day labels

6. TYPOGRAPHY SCALE:
   - h1: fontSize '3rem+', fontWeight 900, letterSpacing '-0.04em', lineHeight 1.05
   - h2: fontSize '1.8rem', fontWeight 800, letterSpacing '-0.03em'
   - Subtitles: fontSize '1.1rem', color '#5d544b', lineHeight 1.65
   - Labels: fontSize '0.72rem', fontWeight 700, letterSpacing '0.06em', textTransform 'uppercase', color '#8a7e72'

7. ACCESSIBILITY & RESPONSIVENESS:
   - Add descriptive 'aria-label' to icon-only buttons and elements without visible text.
   - Ensure layout structural components use semantic roles.
   - Add inline media queries if necessary or flexbox folding for mobile layouts.

8. EMOJI ICONS — Use emoji liberally: section headers, nav items, stat icons, feature titles

════════════════════════
COMPLETE PREMIUM EXAMPLE — Analytics Dashboard
════════════════════════
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
- Root: full-width radial gradient bg, overflow hidden
- HERO: Giant h1 (4rem, gradient text) + subtitle + two CTA buttons, centered, 100px top padding
- Subtle animated glow orb behind hero text:
  <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)', width: 600, height: 600, background: 'radial-gradient(circle, rgba(218,79,47,0.14) 0%, transparent 70%)', pointerEvents: 'none', borderRadius: '50%' }} />
- 3-column feature Cards grid below hero
- Bottom CTA with contrasting background: rgba(218,79,47,0.08), 1px solid rgba(218,79,47,0.2)

LOGIN / SIGNUP — "centered" layout:
- Root: centered flexbox, radial glow background
- Glow orb behind the card: absolute, 400px circle, 12% brand-red opacity
- Card: maxWidth 420px, light glass surface style, generous padding
- Social auth buttons above email/pass for premium feel
- Micro-copy beneath form: "By continuing you agree to our Terms"

TODO / INTERACTIVE — "single-column" layout:
- Use React.useState for items: const [items, setItems] = React.useState([...])
- At least 5 placeholder items pre-populated
- Add: Input + Button row at top; Check + Delete per item
- Completed items: opacity 0.4, textDecoration: 'line-through'
- Empty state with encouraging emoji if list is empty

SETTINGS — "two-column" layout:
- Left nav: list of setting categories with emoji icons (styled pills)
- Right: Card per section with Toggle rows, Inputs, Selects
- Save Button at bottom-right with success Alert on save

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

Design baseline:
- Light premium SaaS visual tone (cream/white surfaces, refined shadows, strong typography).
- Accent interactions using brand-red style highlights.
- Avoid generic placeholder UI; use realistic product content and data.
`;

const CREATIVE_EXPO_GENERATOR_SYSTEM_PROMPT = `You are a senior React Native + Expo app engineer.

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
- Add polished motion and interaction behavior suitable for SaaS apps.
- Keep content realistic, UX-focused, and implementation-ready.
`;

// ---- SYSTEM PROMPT FOR INDIVIDUAL BLOCKS ----

const BLOCK_GENERATOR_SYSTEM_PROMPT = `You are a UI BLOCK GENERATOR agent. Your job is to strictly build ONE piece of a larger UI.

MISSION: Generate a STUNNING, PREMIUM, PRODUCTION-QUALITY React TSX component block.

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
1. GLASSMORPHISM CARDS:
   style={{ background: 'rgba(255,255,255,0.9)', border: '1px solid rgba(21,18,15,0.12)', borderRadius: 24, backdropFilter: 'blur(12px)' }}
2. HOVER MICRO-ANIMATIONS for cards/rows.
3. DENSE REAL DATA: No placeholders. Real terminology.
4. EMOJI ICONS: Use emojis for visual flair.
5. RESPONSIVENESS & ACCESSIBILITY: Build flex/grid layouts that wrap cleanly on small screens. Ensure proper ARIA labeling on actionable elements.

OUTPUT FORMAT:
Return ONLY valid TSX valid.
Do NOT start with 'use client';! Just output the function.
No markdown fences. No extra text. Just code.`;

// ---- SYSTEM PROMPT FOR SHELL (LAYOUT) ----
const SHELL_GENERATOR_SYSTEM_PROMPT = `You are the SHELL GENERATOR agent. Your job is to arrange and layout a set of existing React component blocks into a stunning page.

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
1. AMBIENT BACKGROUND on the root div:
   style={{ minHeight: '100vh', background: 'radial-gradient(ellipse at 15% 10%, rgba(218,79,47,0.1) 0%, transparent 45%), radial-gradient(ellipse at 85% 80%, rgba(240,122,96,0.08) 0%, transparent 40%), #fffdf9', color: '#15120f', display: 'flex' }}
2. GRADIENT TEXT for any page headers you create.
3. Handle flex/grid alignments properly so sidebars stick and main content areas scroll.

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
2. Use DENSE, REALISTIC data matching the description.
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
4. Apply the ambient background to the root container.
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

  if (mode === 'deterministic') {
    return runDeterministicGenerator(plan, onEvent);
  }

  return runCreativeGenerator(plan, target, onEvent);
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
    ? await generateCreativeExpoCode(plan)
    : await generateCreativeWebCode(plan);

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

async function generateCreativeWebCode(plan: PlannerOutput): Promise<string> {
  const userMessage = `Build the app described by this creative plan.

Target: web
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

async function generateCreativeExpoCode(plan: PlannerOutput): Promise<string> {
  const userMessage = `Build an Expo React Native code bundle from this plan.

Target: expo-rn
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
      } else {
        normalized += '\n\nexport default function GeneratedUI() { return null; }\n';
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
    'single-column': 'Stack components vertically in a centered column (max 800px). Ambient radial bg. Dense content.',
    'two-column': 'Two columns via CSS grid. Left: navigation list. Right: main content area.',
    'sidebar-layout': 'Sidebar (fixed left, 220px) + scrollable main. Use our Sidebar component.',
    'dashboard': 'Navbar at top, Sidebar left, main content area with KPI grid + Charts + Table.',
    'centered': 'Content centered horizontally and vertically. Glow orb effect behind the card.',
    'full-width': 'Full-width content with sections. Giant hero, features grid, CTA.',
    'landing-page': 'Hero (4rem gradient h1 + 2 CTAs) + features grid + testimonials + CTA section.',
    'form-page': 'Single-column form layout, centered Card, clear input hierarchy.',
    'app-shell': 'Full-height: Navbar + Sidebar + main scrollable area. Like a real SaaS app.',
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
