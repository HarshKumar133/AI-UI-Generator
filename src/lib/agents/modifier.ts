// ============================================
// MODIFIER AGENT
// Handles iterative edits to existing code
// Modifies existing code rather than full regeneration
// ============================================

import { ComponentType } from '@/types';
import { callGemini } from './geminiClient';
import { getComponentDescriptions } from '../validation';

// ---- PROMPT TEMPLATE ----

const MODIFIER_SYSTEM_PROMPT = `You are the MODIFIER agent in a deterministic UI generation pipeline.

Your job is to MODIFY existing React code based on user instructions.

CRITICAL RULES:
- You MUST preserve the existing code structure as much as possible
- Only change what the user explicitly asks for
- You may ONLY use components from the allowed list
- NO inline styles on components (only on layout wrapper divs for flex/grid)
- NO new component definitions
- NO external imports
- Maintain the "GeneratedUI" function name and default export
- Import components ONLY from '@/components/ui'

${getComponentDescriptions()}

MODIFICATION APPROACH:
1. Identify what the user wants changed
2. Make MINIMAL changes to achieve the goal
3. Preserve all unchanged parts exactly as they are
4. If adding components, use only allowed ones
5. If removing components, clean up properly

OUTPUT FORMAT:
Return a JSON object with:
{
  "code": "<the complete modified TSX code>",
  "changes": "<brief description of what was changed and why>"
}

Return ONLY the JSON, no markdown, no code fences.`;

// ---- MODIFIER FUNCTION ----

export async function runModifier(
  modificationPrompt: string,
  currentCode: string
): Promise<{ code: string; componentList: ComponentType[]; changes: string }> {
  const userMessage = `Current code:
\`\`\`tsx
${currentCode}
\`\`\`

User wants this modification:
"${modificationPrompt}"

Modify the code according to the user's request. Remember:
- Make MINIMAL changes, do NOT rewrite everything
- Preserve all parts the user didn't mention
- Only use allowed components
- Keep the GeneratedUI function name and default export

Return ONLY the JSON with "code" and "changes" fields.`;

  const response = await callGemini(userMessage, MODIFIER_SYSTEM_PROMPT);

  let cleanResponse = response.trim();
  if (cleanResponse.startsWith('`')) {
    cleanResponse = cleanResponse.replace(/^`{3}(?:json)?\s*\n?/, '').replace(/\n?`{3}\s*$/, '');
  }

  try {
    const result = JSON.parse(cleanResponse);
    let code = result.code || currentCode;
    const changes = result.changes || 'Code modified based on your request.';

    // Extract components used
    const componentList = extractComponents(code);

    // Ensure proper imports
    if (!code.includes("from '@/components/ui'") && !code.includes('from "@/components/ui"')) {
      const importLine = `import { ${componentList.join(', ')} } from '@/components/ui';\n`;
      code = `import React from 'react';\n${importLine}\n${code}`;
    }

    return { code, componentList, changes };
  } catch (error) {
    console.error('Modifier JSON parse error:', error);
    // Return original code unchanged on error
    return {
      code: currentCode,
      componentList: extractComponents(currentCode),
      changes: 'Modification failed — original code preserved.',
    };
  }
}

function extractComponents(code: string): ComponentType[] {
  const allowed: ComponentType[] = ['Button', 'Card', 'Input', 'Table', 'Modal', 'Sidebar', 'Navbar', 'Chart'];
  return allowed.filter(comp => new RegExp(`<${comp}[\\s/>]`).test(code));
}