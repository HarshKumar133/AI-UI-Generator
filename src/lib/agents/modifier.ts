// ============================================
// MODIFIER AGENT
// Handles iterative edits to existing code
// Modifies existing code rather than full regeneration
// Context-aware: receives previous plan and explanation
// ============================================

import { ComponentType } from '@/types';
import { callGemini } from './geminiClient';
import { getComponentDescriptions } from '../validation';

// ---- PROMPT TEMPLATE ----

const MODIFIER_SYSTEM_PROMPT = `You are the MODIFIER agent in a deterministic UI generation pipeline.

Your job is to MODIFY existing React code based on user instructions.
You must make MINIMAL, TARGETED changes — never rewrite the entire component unless explicitly asked.

CRITICAL RULES:
- PRESERVE the existing code structure as much as possible
- Only change what the user explicitly asks for
- You may ONLY use components from the allowed list
- NO inline styles on components (only on layout wrapper divs for flex/grid)
- NO new component definitions
- NO external imports
- Maintain the "GeneratedUI" function name and default export
- Import components ONLY from '@/components/ui'
- If user says "add", ADD to existing — don't replace
- If user says "remove", REMOVE only that — keep everything else
- If user says "change", MODIFY only the targeted part

${getComponentDescriptions()}

MODIFICATION APPROACH:
1. Read the current code carefully
2. Identify EXACTLY what the user wants changed
3. Make the MINIMUM changes needed
4. Preserve ALL unchanged parts exactly as they are
5. Update imports if components were added/removed
6. NEVER remove components the user didn't mention

OUTPUT FORMAT:
Return a JSON object with these fields:
{
  "code": "<the complete modified TSX code>",
  "changes": "<brief description of what was changed>",
  "added": ["<components added, if any>"],
  "removed": ["<components removed, if any>"],
  "modified": ["<components modified, if any>"]
}

Return ONLY the JSON, no markdown, no code fences.`;

// ---- MODIFIER FUNCTION ----

export async function runModifier(
    modificationPrompt: string,
    currentCode: string,
    previousContext?: { layout?: string; componentList?: ComponentType[] }
): Promise<{
    code: string;
    componentList: ComponentType[];
    changes: string;
    changeDetails: { added: string[]; removed: string[]; modified: string[] };
}> {
    const contextInfo = previousContext
        ? `\nPrevious context:
- Layout: ${previousContext.layout || 'unknown'}
- Components in use: ${previousContext.componentList?.join(', ') || 'unknown'}`
        : '';

    const userMessage = `Current code:
\`\`\`tsx
${currentCode}
\`\`\`
${contextInfo}

User wants this modification:
"${modificationPrompt}"

IMPORTANT:
- Make MINIMAL changes to achieve the user's request
- Do NOT rewrite the entire component
- Preserve all parts the user didn't mention
- Only use allowed components (Button, Card, Input, Table, Modal, Sidebar, Navbar, Chart)
- Keep the GeneratedUI function name and default export

Return ONLY the JSON with "code", "changes", "added", "removed", and "modified" fields.`;

    const response = await callGemini(userMessage, MODIFIER_SYSTEM_PROMPT);

    let cleanResponse = response.trim();
    if (cleanResponse.startsWith('`')) {
        cleanResponse = cleanResponse.replace(/^`{3}(?:json)?\s*\n?/, '').replace(/\n?`{3}\s*$/, '');
    }

    try {
        const result = JSON.parse(cleanResponse);
        let code = result.code || currentCode;
        const changes = result.changes || 'Code modified based on your request.';
        const changeDetails = {
            added: result.added || [],
            removed: result.removed || [],
            modified: result.modified || [],
        };

        // Extract components used
        const componentList = extractComponents(code);

        // Ensure proper imports
        if (!code.includes("from '@/components/ui'") && !code.includes('from "@/components/ui"')) {
            const importLine = `import { ${componentList.join(', ')} } from '@/components/ui';\n`;
            code = `import React from 'react';\n${importLine}\n${code}`;
        }

        return { code, componentList, changes, changeDetails };
    } catch (error) {
        console.error('Modifier JSON parse error:', error);
        return {
            code: currentCode,
            componentList: extractComponents(currentCode),
            changes: 'Modification failed — original code preserved.',
            changeDetails: { added: [], removed: [], modified: [] },
        };
    }
}

function extractComponents(code: string): ComponentType[] {
    const allowed: ComponentType[] = ['Button', 'Card', 'Input', 'Table', 'Modal', 'Sidebar', 'Navbar', 'Chart'];
    return allowed.filter(comp => new RegExp(`<${comp}[\\s/>]`).test(code));
}