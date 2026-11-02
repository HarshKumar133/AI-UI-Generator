import { NextRequest, NextResponse } from 'next/server';
import { callGemini } from '@/lib/agents/geminiClient';
import { resolveGenerationMode, resolveTarget } from '@/lib/agents/strategy';
import { normalizeConversationContext } from '@/lib/agents/conversationContext';
import { sanitizePrompt, validateGeneratedArtifact } from '@/lib/validation';

const MAX_HTML_REPAIR_ATTEMPTS = 2;

const FULL_APP_SYSTEM_PROMPT = `You are an elite front-end engineer generating complete, self-contained single-file HTML apps.

Output rules:
- Return ONE valid HTML file starting with <!DOCTYPE html>.
- You may use best-fit CDN libraries (Tailwind, Chart.js, GSAP, etc) when useful.
- Build a premium UI/UX result with clear hierarchy, motion, and responsive behavior.
- Give the interface a distinctive art direction tailored to the request; avoid generic blank canvases and repetitive cards.
- Keep the layout responsive and interactive without blocking the main thread or making controls unresponsive.
- Avoid dark-mode lock-in; choose a polished palette that fits the request.
- Include meaningful interactions and loading/empty states.
- Use semantic HTML and accessibility attributes.
- Return structurally valid HTML with syntactically valid inline JavaScript and CSS.
- No markdown fences, no explanations, only HTML.
`;

const HTML_MODIFIER_SYSTEM_PROMPT = `You are an expert UI engineer editing an existing standalone HTML application.

Rules:
- Treat the current HTML as the source of truth and return one complete updated HTML document.
- Understand the latest request using the recent conversation and existing document; resolve references like "it", "that", and "same style" from context.
- Preserve the app's purpose, visual identity, content, and working interactions unless the user asks to change them.
- Make only the requested changes; do not regenerate a different app or remove unrelated features.
- Keep the result responsive, accessible, and fast, with no blocking interactions.
- Return valid HTML only, with syntactically valid inline JavaScript and CSS. No markdown or explanation.
`;

function stripCodeFences(content: string): string {
  const trimmed = content.trim();
  if (!trimmed.startsWith('```')) {
    return trimmed;
  }
  return trimmed.replace(/^```(?:html)?\s*\n?/, '').replace(/\n?```\s*$/, '');
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const rawPrompt = body.prompt as string | undefined;

    if (!rawPrompt?.trim()) {
      return NextResponse.json({ success: false, error: 'Prompt required' }, { status: 400 });
    }

    const prompt = sanitizePrompt(rawPrompt);
    const mode = resolveGenerationMode(body.generationMode);
    const target = resolveTarget(prompt, body.targetPreference);
    const currentHtml = typeof body.currentHtml === 'string' ? body.currentHtml : '';
    const currentTitle = typeof body.currentTitle === 'string' ? sanitizePrompt(body.currentTitle).slice(0, 120) : '';
    const conversationContext = normalizeConversationContext(body.conversationContext);
    const isFollowUp = currentHtml.trim().length > 0;
    const contextTranscript = conversationContext
      .map((turn) => `${turn.role === 'user' ? 'User' : 'Assistant'}: ${turn.content}`)
      .join('\n');

    let userMessage = isFollowUp
      ? `Update the existing standalone HTML app in response to the latest follow-up.

Current app goal: ${currentTitle || 'Continue the existing app'}
Recent conversation (oldest first):
${contextTranscript || '(no earlier turns provided)'}

Latest user request: "${prompt}"

Current complete HTML source:
\`\`\`html
${currentHtml}
\`\`\`

Apply the request to this app, preserving everything unrelated. Return the complete updated HTML document, not a patch.`
      : `Build a complete, production-grade app for:
"${prompt}"

Generation mode: ${mode}
Requested target: ${target}

If target is "expo-rn", create a high-fidelity mobile-style web approximation in HTML (device-oriented layout),
while preserving interaction and motion quality.

Return only HTML.`;
    const systemPrompt = isFollowUp ? HTML_MODIFIER_SYSTEM_PROMPT : FULL_APP_SYSTEM_PROMPT;

    let cleanHtml = '';
    let validation = validateGeneratedArtifact({ format: 'html', code: cleanHtml }, 'html');

    for (let attempt = 0; attempt <= MAX_HTML_REPAIR_ATTEMPTS; attempt += 1) {
      cleanHtml = stripCodeFences(await callGemini(userMessage, systemPrompt));
      validation = validateGeneratedArtifact({ format: 'html', code: cleanHtml }, 'html');
      if (validation.isValid) break;

      if (attempt === MAX_HTML_REPAIR_ATTEMPTS) {
        throw new Error(`Generated HTML failed validation after ${MAX_HTML_REPAIR_ATTEMPTS} automatic repair attempts.\n${validation.diagnostics}`);
      }

      console.warn(`[API /generate-app] HTML validation failed; retrying (${attempt + 1}/${MAX_HTML_REPAIR_ATTEMPTS}).`, validation.diagnostics);
      userMessage = `Repair the complete HTML application you just generated or modified. Return one corrected full HTML document, not a patch.

${isFollowUp ? `Current app goal: ${currentTitle || 'Continue the existing app'}
Recent conversation:
${contextTranscript || '(no earlier turns provided)'}
Latest follow-up request: "${prompt}"` : `Original request: "${prompt}"`}
Generation mode: ${mode}
Requested target: ${target}

Exact HTML/JavaScript/CSS parser and schema diagnostics from the previous attempt:
${validation.diagnostics}

Previous candidate:
\`\`\`html
${cleanHtml}
\`\`\`

Fix every reported diagnostic and preserve the intended design and interactions. Keep it responsive, performant, and fully self-contained apart from optional CDN assets. Return only HTML.`;
    }

    const title = (currentTitle || prompt).trim().slice(0, 60);

    return NextResponse.json({
      success: true,
      data: {
        html: cleanHtml,
        title,
        outputMode: 'html',
        metadata: {
          mode,
          target,
          runtime: 'html',
          selectedLibraries: [],
        },
      },
    });
  } catch (error) {
    console.error('[/api/generate-app] Error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Generation failed' },
      { status: 500 }
    );
  }
}
