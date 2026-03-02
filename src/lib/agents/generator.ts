// ============================================
// AGENT STEP 2: GENERATOR
// Converts the structured plan into React UI code
// Uses allowed components + HTML layout tags
// ============================================

import { PlannerOutput, GeneratorOutput, ComponentType } from '@/types';
import { callGemini } from './geminiClient';
import { getComponentDescriptions } from '../validation';

// ---- ALL ALLOWED COMPONENT TYPES ----

const ALL_COMPONENTS: ComponentType[] = [
  'Button', 'Card', 'Input', 'Table', 'Modal', 'Sidebar', 'Navbar',
  'Chart', 'Badge', 'Avatar', 'Progress', 'Stat', 'Alert', 'Toggle',
  'Tabs', 'Divider', 'Select',
];

// ---- PEAK-QUALITY PROMPT TEMPLATE ----

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
   style={{ background: 'linear-gradient(135deg, #f0f2f5 0%, #10b981 60%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', margin: 0 }}

2. AMBIENT BACKGROUND — Page root must have layered radial gradients:
   style={{ minHeight: '100vh', background: 'radial-gradient(ellipse at 15% 10%, rgba(16,185,129,0.09) 0%, transparent 45%), radial-gradient(ellipse at 85% 80%, rgba(59,130,246,0.07) 0%, transparent 40%), #09090b' }}

3. GLASSMORPHISM CARDS — Key containers:
   style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 24, backdropFilter: 'blur(12px)' }}

4. HOVER MICRO-ANIMATIONS — Every feature card MUST use:
   const [h, setH] = React.useState(false);
   style={{ transform: h ? 'translateY(-5px) scale(1.015)' : 'none', transition: 'all 280ms cubic-bezier(0.34, 1.56, 0.64, 1)', boxShadow: h ? '0 24px 60px rgba(0,0,0,0.45), 0 0 0 1px rgba(16,185,129,0.12)' : '0 2px 12px rgba(0,0,0,0.2)' }}

5. DENSE REAL DATA — No placeholder content. Real business-like data:
   - Months: Jan–Dec, realistic numbers (revenue $120k–$500k, users 10k–200k)
   - Table rows: 5+ rows, each with 4+ columns of realistic data
   - Charts: 6-8 data points minimum with actual month/day labels

6. TYPOGRAPHY SCALE:
   - h1: fontSize '3rem+', fontWeight 900, letterSpacing '-0.04em', lineHeight 1.05
   - h2: fontSize '1.8rem', fontWeight 800, letterSpacing '-0.03em'
   - Subtitles: fontSize '1.1rem', color '#a0aab4', lineHeight 1.65
   - Labels: fontSize '0.72rem', fontWeight 700, letterSpacing '0.06em', textTransform 'uppercase', color '#6b7280'

7. EMOJI ICONS — Use emoji liberally: section headers, nav items, stat icons, feature titles

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
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: 'radial-gradient(ellipse at 10% 5%, rgba(16,185,129,0.08) 0%, transparent 40%), radial-gradient(ellipse at 90% 90%, rgba(59,130,246,0.06) 0%, transparent 35%), #09090b', color: '#eceff2', fontFamily: "'Inter', system-ui, sans-serif", overflow: 'hidden' }}>
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
              <h1 style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '-0.04em', background: 'linear-gradient(135deg, #f0f2f5 20%, #10b981 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', margin: 0 }}>Business Overview</h1>
              <p style={{ color: '#6b7280', fontSize: '0.82rem', marginTop: 4 }}>Last updated: Feb 22, 2026, 10:14 AM · All regions</p>
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
              <div key={i} style={{ background: 'rgba(255,255,255,0.028)', border: '1px solid rgba(255,255,255,0.065)', borderRadius: 20, padding: '22px 24px' }}>
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
  <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)', width: 600, height: 600, background: 'radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)', pointerEvents: 'none', borderRadius: '50%' }} />
- 3-column feature Cards grid below hero
- Bottom CTA with contrasting background: rgba(16,185,129,0.06), 1px solid rgba(16,185,129,0.15)

LOGIN / SIGNUP — "centered" layout:
- Root: centered flexbox, radial glow background
- Glow orb behind the card: absolute, 400px circle, 12% emerald opacity
- Card: maxWidth 420px, glassmorphism style, generous padding
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

// ---- GENERATOR FUNCTION ----

export async function runGenerator(plan: PlannerOutput): Promise<GeneratorOutput> {
  const userMessage = `Convert this plan into a STUNNING, PREMIUM React TSX component.

PLAN:
${JSON.stringify(plan, null, 2)}

REQUIREMENTS:
1. Component name: GeneratedUI (default export)
2. First line: 'use client';
3. Layout type: "${plan.layout}" — see system prompt for exact layout guidance
4. Apply ALL the premium design mandates: gradient text, ambient bg, glassmorphism, hover animations
5. Use DENSE, REALISTIC data (actual numbers, real names, real dates)
6. Every component from the plan must be used: ${plan.components.map(c => c.type).filter((v, i, a) => a.indexOf(v) === i).join(', ')}

${getLayoutGuidance(plan.layout)}

Return ONLY TSX code. No markdown, no explanation.`;

  const response = await callGemini(userMessage, GENERATOR_SYSTEM_PROMPT);

  // Clean the response
  let code = response.trim();
  if (code.startsWith('`')) {
    code = code.replace(/^`{3}(?:tsx?|jsx?|typescript|javascript)?\s*\n?/, '').replace(/\n?`{3}\s*$/, '');
  }

  // Ensure 'use client' at top
  if (!code.startsWith("'use client'") && !code.startsWith('"use client"')) {
    code = `'use client';\n${code}`;
  }

  // Ensure React import
  if (!code.includes("from 'react'") && !code.includes('from "react"')) {
    code = code.replace("'use client';\n", "'use client';\nimport React from 'react';\n");
  }

  // Ensure UI import exists
  if (!code.includes("from '@/components/ui'") && !code.includes('from "@/components/ui"')) {
    const usedComponents = extractUsedComponents(code);
    if (usedComponents.length > 0) {
      const importLine = `import { ${usedComponents.join(', ')} } from '@/components/ui';\n`;
      const firstNewline = code.indexOf('\n');
      code = code.slice(0, firstNewline + 1) + importLine + code.slice(firstNewline + 1);
    }
  }

  // Ensure default export
  if (!code.includes('export default')) {
    code = code.replace(/^(export )?function GeneratedUI/m, 'export default function GeneratedUI');
    if (!code.includes('export default')) {
      code += '\nexport default GeneratedUI;';
    }
  }

  const componentList = extractUsedComponents(code);
  return { code, componentList };
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

// ---- HELPER: Extract component names from code ----

function extractUsedComponents(code: string): ComponentType[] {
  const used: ComponentType[] = [];
  for (const comp of ALL_COMPONENTS) {
    const regex = new RegExp(`<${comp}[\\s/>{]`, 'g');
    if (regex.test(code)) {
      used.push(comp);
    }
  }
  return used;
}