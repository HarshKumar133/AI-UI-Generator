// ============================================
// AGENT STEP 2: GENERATOR
// Converts the structured plan into React UI code
// Uses ONLY allowed components — no new components, no inline styles
// ============================================

import { PlannerOutput, GeneratorOutput, ComponentType } from '@/types';
import { callGemini } from './geminiClient';
import { getComponentDescriptions } from '../validation';

// ---- PROMPT TEMPLATE (Hard-coded, visible in code as required) ----

const GENERATOR_SYSTEM_PROMPT = `You are the GENERATOR agent in a deterministic UI generation pipeline.

Your job is to convert a structured component plan into RICH, BEAUTIFUL React/JSX code that looks professional and impressive.

CRITICAL RULES:
- You MUST import components ONLY from '@/components/ui'
- You may ONLY use these components: Button, Card, Input, Table, Modal, Sidebar, Navbar, Chart
- NO custom CSS classes
- NO external library imports
- NO new component definitions
- NO dangerouslySetInnerHTML
- The output must be a single React functional component named "GeneratedUI"
- Use TypeScript/TSX syntax
- The component should be a default export

${getComponentDescriptions()}

QUALITY RULES (VERY IMPORTANT):
- ALWAYS use ALL available props for each component — don't leave any prop empty
- Button: ALWAYS set variant ("primary", "secondary", "ghost", "danger") and use emoji in labels
- Card: ALWAYS set title (with emoji) AND subtitle. Nest components inside Cards.
- Input: ALWAYS set label (with emoji) AND placeholder
- Table: ALWAYS use 3-5 columns and 4-6 rows of REALISTIC data. Set striped to true.
- Chart: ALWAYS use 5-7 data points with meaningful labels. Set a title and height.
- Sidebar: Use groups prop with 2-3 groups, each with 3-4 items with emoji icons
- Navbar: Set brand with emoji AND 3-5 links AND action buttons
- Modal: Set title with emoji, size, and nest Input/Button inside as form content
- Use realistic example data: real names, real dollar amounts, real percentages, real dates

LAYOUT STYLING:
For layout purposes ONLY, you may use div wrappers with these layout styles:
- display: flex/grid
- flexDirection, alignItems, justifyContent
- gap (use 16px-24px for good spacing)
- padding (use 24px-32px for breathing room)
- margin, width, height, maxWidth, minHeight
- gridTemplateColumns (e.g. "repeat(auto-fit, minmax(300px, 1fr))" for responsive grids)
- borderRadius: '12px' on wrapper divs for modern look
These layout div styles are the ONLY exception. Component styling is handled internally.

EXAMPLE HIGH-QUALITY OUTPUT:
import React from 'react';
import { Button, Card, Input, Table, Chart, Navbar } from '@/components/ui';

export default function GeneratedUI() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar brand="🚀 SalesHub" items={[{label:'Dashboard',href:'#'},{label:'Analytics',href:'#'},{label:'Customers',href:'#'},{label:'Settings',href:'#'}]} actions={[{label:'✨ New Report',variant:'primary'}]} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', padding: '24px' }}>
        <Card title="📊 Revenue Overview" subtitle="Monthly performance tracking">
          <Chart type="bar" title="Monthly Revenue" data={[{label:'Jan',value:42000},{label:'Feb',value:38000},{label:'Mar',value:55000},{label:'Apr',value:47000},{label:'May',value:61000},{label:'Jun',value:58000}]} height={250} />
        </Card>
        <Card title="👥 Recent Customers" subtitle="Latest sign-ups this week">
          <Table columns={[{key:'name',header:'Name'},{key:'email',header:'Email'},{key:'plan',header:'Plan'},{key:'revenue',header:'Revenue'}]} data={[{name:'Sarah Chen',email:'sarah@acme.co',plan:'Enterprise',revenue:'$12,400'},{name:'James Wilson',email:'james@startup.io',plan:'Pro',revenue:'$4,200'},{name:'Maria Garcia',email:'maria@corp.com',plan:'Enterprise',revenue:'$8,900'},{name:'Alex Kim',email:'alex@tech.dev',plan:'Starter',revenue:'$1,200'}]} striped={true} />
        </Card>
        <Card title="📝 Quick Actions" subtitle="Frequently used tools">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Input label="🔍 Search Customers" placeholder="Enter name or email..." type="search" />
            <div style={{ display: 'flex', gap: '8px' }}>
              <Button variant="primary">✨ Generate Report</Button>
              <Button variant="secondary">📤 Export Data</Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

OUTPUT FORMAT:
Return ONLY valid TSX code. No markdown, no code fences, no explanations.
The code must start with import statements and end with the export.`;

// ---- GENERATOR FUNCTION ----

export async function runGenerator(plan: PlannerOutput): Promise<GeneratorOutput> {
    const userMessage = `Convert this component plan into a React component:

PLAN:
${JSON.stringify(plan, null, 2)}

Requirements:
1. Create a single functional component named "GeneratedUI" with default export
2. Import ONLY from '@/components/ui': ${plan.components.map(c => c.type).filter((v, i, a) => a.indexOf(v) === i).join(', ')}
3. Use the layout type "${plan.layout}" to structure the components
4. Apply all props from the plan to each component
5. NO inline styles on components (only on layout wrapper divs)
6. Handle children arrays properly - strings become text, objects become nested components

Layout guidance for "${plan.layout}":
${getLayoutGuidance(plan.layout)}

Return ONLY the TSX code, nothing else.`;

    const response = await callGemini(userMessage, GENERATOR_SYSTEM_PROMPT);

    // Clean the response
    let code = response.trim();

    // Remove markdown code fences if present
    if (code.startsWith('`')) {
        code = code.replace(/^`{3}(?:tsx?|jsx?|typescript|javascript)?\s*\n?/, '').replace(/\n?`{3}\s*$/, '');
    }

    // Ensure the code has the required import
    if (!code.includes("from '@/components/ui'") && !code.includes('from "@/components/ui"')) {
        const usedComponents = extractUsedComponents(code);
        const importLine = `import { ${usedComponents.join(', ')} } from '@/components/ui';\n`;
        if (!code.startsWith('import React')) {
            code = `import React from 'react';\n${importLine}\n${code}`;
        } else {
            const firstNewline = code.indexOf('\n');
            code = code.slice(0, firstNewline + 1) + importLine + code.slice(firstNewline + 1);
        }
    }

    // Ensure it has a default export
    if (!code.includes('export default')) {
        code = code.replace(
            /function GeneratedUI/,
            'export default function GeneratedUI'
        );
    }

    // Extract the list of components used
    const componentList = extractUsedComponents(code);

    return {
        code,
        componentList,
    };
}

// ---- HELPER: Provide layout-specific guidance ----

function getLayoutGuidance(layout: string): string {
    const guides: Record<string, string> = {
        'single-column': `Use a single vertical column:
  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '24px', maxWidth: '800px', margin: '0 auto' }}>`,
        'two-column': `Use a two-column grid:
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', padding: '24px' }}>`,
        'sidebar-layout': `Use a sidebar + main content layout:
  <div style={{ display: 'flex', height: '100vh' }}>
    <Sidebar ... />
    <main style={{ flex: 1, padding: '24px', overflow: 'auto' }}>`,
        'dashboard': `Use a dashboard grid layout:
  <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
    <Navbar ... />
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px', padding: '24px' }}>`,
        'centered': `Center content in the viewport:
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '24px' }}>
    <div style={{ maxWidth: '500px', width: '100%' }}>`,
        'full-width': `Use full width layout:
  <div style={{ width: '100%', padding: '24px' }}>`,
    };

    return guides[layout] || guides['single-column'];
}

// ---- HELPER: Extract component names from code ----

function extractUsedComponents(code: string): ComponentType[] {
    const allowed: ComponentType[] = ['Button', 'Card', 'Input', 'Table', 'Modal', 'Sidebar', 'Navbar', 'Chart'];
    const used: ComponentType[] = [];

    for (const comp of allowed) {
        // Check if component is used in JSX (e.g., <Button or <Card)
        const regex = new RegExp(`<${comp}[\\s/>]`, 'g');
        if (regex.test(code)) {
            used.push(comp);
        }
    }

    return used;
}