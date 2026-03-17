// ============================================
// MODIFIER AGENT
// Handles iterative edits to existing code
// Modifies existing code rather than full regeneration
// Context-aware: receives previous plan and explanation
// ============================================

import { ComponentType, GenerationMode, GenerationTarget, PreviewArtifact, GenerationMetadata } from '@/types';
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

const CREATIVE_MODIFIER_SYSTEM_PROMPT = `You are a CREATIVE UI CODE EDITOR for a SaaS app builder.

Your job is to modify existing code with precision while preserving untouched behavior.

Rules:
- Keep changes tightly scoped to user intent.
- You may use any suitable UI/UX libraries if needed.
- Preserve the existing architecture where possible.
- For web targets: keep output as valid TSX with GeneratedUI default export.
- For expo-rn targets: keep output as a multi-file bundle using // FILE: path markers.
- Return JSON only with fields:
{
  "code": "...full updated code...",
  "changes": "brief summary",
  "added": ["..."],
  "removed": ["..."],
  "modified": ["..."]
}
`;

interface ModifierRunOptions {
  mode?: GenerationMode;
  target?: GenerationTarget;
}

// ---- MODIFIER FUNCTION ----

export async function runModifier(
    modificationPrompt: string,
    currentCode: string,
    previousContext?: { layout?: string; componentList?: string[] },
    options: ModifierRunOptions = {}
): Promise<{
    code: string;
    componentList: string[];
    previewArtifact?: PreviewArtifact;
    metadata: GenerationMetadata;
    changes: string;
    changeDetails: { added: string[]; removed: string[]; modified: string[] };
}> {
    const mode = options.mode ?? 'creative';
    const target = options.target ?? 'web';
    const contextInfo = previousContext
        ? `\nPrevious context:
- Layout: ${previousContext.layout || 'unknown'}
- Components in use: ${previousContext.componentList?.join(', ') || 'unknown'}`
        : '';

    const modeRules = mode === 'deterministic'
        ? `- Only use allowed components (Button, Card, Input, Table, Modal, Sidebar, Navbar, Chart)
- Keep the GeneratedUI function name and default export`
        : `- Target is "${target}" (web or expo-rn)
- Keep changes minimal but allow best-fit UI/UX libraries when needed
- Preserve existing architecture unless user explicitly asks for refactor`;

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
${modeRules}

Return ONLY the JSON with "code", "changes", "added", "removed", and "modified" fields.`;

    const systemPrompt = mode === 'deterministic' ? MODIFIER_SYSTEM_PROMPT : CREATIVE_MODIFIER_SYSTEM_PROMPT;
    const response = await callGemini(userMessage, systemPrompt);

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

        if (mode !== 'deterministic' && target === 'web') {
            code = ensureGeneratedUI(code);
        }

        // Extract components/libraries used
        const componentList = mode === 'deterministic' ? extractComponents(code) : extractImports(code);

        // Ensure proper imports
        if (mode === 'deterministic' && !code.includes("from '@/components/ui'") && !code.includes('from "@/components/ui"')) {
            const importLine = `import { ${componentList.join(', ')} } from '@/components/ui';\n`;
            code = `import React from 'react';\n${importLine}\n${code}`;
        }

        return {
            code,
            componentList,
            previewArtifact: mode !== 'deterministic' && target === 'expo-rn' ? buildExpoPreviewArtifact(modificationPrompt, componentList) : undefined,
            metadata: {
                mode,
                target,
                runtime: target === 'expo-rn' ? 'expo-rn' : 'nextjs',
                selectedLibraries: componentList,
            },
            changes,
            changeDetails,
        };
    } catch (error) {
        console.error('Modifier JSON parse error:', error);
        return {
            code: currentCode,
            componentList: mode === 'deterministic' ? extractComponents(currentCode) : extractImports(currentCode),
            previewArtifact: mode !== 'deterministic' && target === 'expo-rn'
                ? buildExpoPreviewArtifact(modificationPrompt, extractImports(currentCode))
                : undefined,
            metadata: {
                mode,
                target,
                runtime: target === 'expo-rn' ? 'expo-rn' : 'nextjs',
                selectedLibraries: extractImports(currentCode),
            },
            changes: 'Modification failed — original code preserved.',
            changeDetails: { added: [], removed: [], modified: [] },
        };
    }
}

function extractComponents(code: string): ComponentType[] {
    const allowed: ComponentType[] = ['Button', 'Card', 'Input', 'Table', 'Modal', 'Sidebar', 'Navbar', 'Chart'];
    return allowed.filter(comp => new RegExp(`<${comp}[\\s/>]`).test(code));
}

function extractImports(code: string): string[] {
    const regex = /^\s*import[\s\S]*?from\s+['"]([^'"]+)['"];?/gm;
    const out = new Set<string>();
    let match: RegExpExecArray | null = null;
    while ((match = regex.exec(code)) !== null) {
        if (match[1]) out.add(match[1]);
    }
    if (out.size === 0 && /react-native|expo/i.test(code)) {
        out.add('react-native');
        out.add('expo');
    }
    return Array.from(out);
}

function ensureGeneratedUI(code: string): string {
    let normalized = code.trim();
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
    return normalized;
}

function buildExpoPreviewArtifact(prompt: string, libraries: string[]): PreviewArtifact {
    const chips = (libraries.length > 0 ? libraries : ['react-native', 'expo'])
        .slice(0, 6)
        .map((lib) => `<span class="chip">${escapeHtml(lib)}</span>`)
        .join('');

    return {
        kind: 'html',
        title: 'Expo Mobile Preview',
        description: 'Preview artifact for modified Expo output',
        content: `<!DOCTYPE html>
<html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
<style>
body{margin:0;min-height:100vh;display:grid;place-items:center;background:#fffaf4;font-family:Inter,system-ui,sans-serif}
.phone{width:min(390px,92vw);border-radius:28px;padding:12px;background:#111;box-shadow:0 26px 64px rgba(30,20,16,.34)}
.screen{border-radius:20px;background:#fffdf9;border:1px solid rgba(21,18,15,.1);overflow:hidden}
.bar{padding:14px 16px;border-bottom:1px solid rgba(21,18,15,.08);font-weight:700}
.body{padding:14px;display:grid;gap:12px}
.card{border:1px solid rgba(21,18,15,.1);background:#fff;border-radius:12px;padding:10px;animation:in .5s ease both}
.chip{display:inline-flex;border-radius:999px;padding:4px 8px;border:1px solid rgba(218,79,47,.25);background:rgba(218,79,47,.08);color:#b73d22;font-size:11px;font-weight:700;margin:2px}
@keyframes in{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
</style></head>
<body>
<div class="phone"><div class="screen"><div class="bar">📱 Modified Expo Preview</div><div class="body">
<div class="card"><strong>Update Goal</strong><div style="margin-top:6px;color:#433d37;font-size:13px;line-height:1.5">${escapeHtml(prompt)}</div></div>
<div class="card"><strong>Libraries</strong><div style="margin-top:6px">${chips}</div></div>
<div class="card"><strong>Status</strong><div style="margin-top:6px;color:#6b625a;font-size:13px">Preview artifact refreshed for mobile-target modification.</div></div>
</div></div></div>
</body></html>`,
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
