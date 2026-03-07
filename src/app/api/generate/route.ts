import { NextRequest, NextResponse } from 'next/server';
import { orchestrateGeneration } from '@/lib/agents';
import { GenerateRequest, ApiResponse, GenerationResult } from '@/types';
import { getVersionHistory, addVersion } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    try {
        const body: GenerateRequest = await request.json();

        if (!body.prompt || body.prompt.trim().length === 0) {
            return NextResponse.json(
                { success: false, error: 'Prompt is required' },
                { status: 400 }
            );
        }

        const currentVersion = getVersionHistory().length;

        const stream = new ReadableStream({
            async start(controller) {
                const encoder = new TextEncoder();

                const sendEvent = (event: any) => {
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
                };

                try {
                    const result = await orchestrateGeneration(body.prompt, currentVersion, sendEvent);

                    // Store version
                    addVersion({
                        version: result.version,
                        code: result.generation.code,
                        prompt: result.userPrompt,
                        plan: result.plan,
                        explanation: result.explanation,
                        timestamp: result.timestamp,
                    });

                } catch (error) {
                    console.error('[API /generate] Stream error:', error);
                    sendEvent({ type: 'error', message: error instanceof Error ? error.message : 'Generation failed' });
                } finally {
                    controller.close();
                }
            }
        });

        return new NextResponse(stream, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache, no-transform',
                'Connection': 'keep-alive',
            },
        });

    } catch (error) {
        console.error('[API /generate] Error parsing request:', error);
        return NextResponse.json(
            { success: false, error: 'Invalid request' },
            { status: 400 }
        );
    }
}