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

Your job is to convert a structured component plan into valid React/JSX code.

CRITICAL RULES:
- You MUST import components ONLY from '@/components/ui'
- You may ONLY use these components: Button, Card, Input, Table, Modal, Sidebar, Navbar, Chart
- NO inline styles (style={{...}}) are allowed
- NO custom CSS classes
- NO external library imports
- NO new component definitions
- NO dangerouslySetInnerHTML
- The output must be a single React functional component named "GeneratedUI"
- Use TypeScript/TSX syntax
- The component should be a default export

${getComponentDescriptions()}

OUTPUT FORMAT:
Return ONLY valid TSX code. No markdown, no code fences, no explanations.
The code must start with import statements and end with the export.

EXAMPLE OUTPUT:
import React from 'react';
import { Button, Card, Input } from '@/components/ui';

export default function GeneratedUI() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '24px' }}>
      <Card title="Welcome">
        <Input label="Name" placeholder="Enter your name" />
        <Button variant="primary">Submit</Button>
      </Card>
    </div>
  );
}

IMPORTANT: For layout purposes ONLY, you may use basic div wrappers with these specific layout styles:
- display: flex/grid
- flexDirection, alignItems, justifyContent
- gap, padding, margin
- width, height, maxWidth
- gridTemplateColumns
These layout div styles are the ONLY exception. Component styling is handled internally by CSS Modules.`;

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