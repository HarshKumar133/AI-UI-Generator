import { NextRequest, NextResponse } from 'next/server';
import { callGemini } from '@/lib/agents/geminiClient';
import { resolveGenerationMode, resolveTarget } from '@/lib/agents/strategy';

const FULL_APP_SYSTEM_PROMPT = `You are an elite front-end engineer generating complete, self-contained single-file HTML apps.

Output rules:
- Return ONE valid HTML file starting with <!DOCTYPE html>.
- You may use best-fit CDN libraries (Tailwind, Chart.js, GSAP, etc) when useful.
- Build a premium UI/UX result with clear hierarchy, motion, and responsive behavior.
- Avoid dark-mode lock-in; choose a polished palette that fits the request.
- Include meaningful interactions and loading/empty states.
- Use semantic HTML and accessibility attributes.
- No markdown fences, no explanations, only HTML.
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
    const prompt = body.prompt as string | undefined;

    if (!prompt?.trim()) {
      return NextResponse.json({ success: false, error: 'Prompt required' }, { status: 400 });
    }

    const mode = resolveGenerationMode(body.generationMode);
    const target = resolveTarget(prompt, body.targetPreference);

    const userMessage = `Build a complete, production-grade app for:
"${prompt}"

Generation mode: ${mode}
Requested target: ${target}

If target is "expo-rn", create a high-fidelity mobile-style web approximation in HTML (device-oriented layout),
while preserving interaction and motion quality.

Return only HTML.`;

    const html = await callGemini(userMessage, FULL_APP_SYSTEM_PROMPT);
    const cleanHtml = stripCodeFences(html);
    const title = prompt.trim().slice(0, 60);

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
