import { NextRequest, NextResponse } from 'next/server';
import { orchestrateGeneration } from '@/lib/agents';
import { GenerateRequest, GenerationEvent } from '@/types';
import { requireUserId } from '@/lib/auth/server';
import { apiError } from '@/lib/api/errors';
import { persistVersion } from '@/lib/db/repository';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    try {
        const body: GenerateRequest = await request.json();
        const ownerId = await requireUserId();

        if (!body.prompt || body.prompt.trim().length === 0) {
            return NextResponse.json(
                { success: false, error: 'Prompt is required' },
                { status: 400 }
            );
        }

        const currentVersion = Number.isInteger(body.currentVersion) && body.currentVersion! >= 0
            ? body.currentVersion!
            : 0;

        const stream = new ReadableStream({
            async start(controller) {
                const encoder = new TextEncoder();

                const sendEvent = (event: GenerationEvent) => {
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
                };

                try {
                    const result = await orchestrateGeneration(
                        body.prompt,
                        currentVersion,
                        (event) => {
                            if (event.type !== 'complete') sendEvent(event);
                        },
                        {
                            generationMode: body.generationMode,
                            targetPreference: body.targetPreference,
                        }
                    );
                    const source = result.generation.primaryCode || result.generation.code;
                    try {
                        const saved = await persistVersion(ownerId, {
                            assistantMessage: result.explanation.explanation,
                            projectId: typeof body.projectId === 'string' ? body.projectId : undefined,
                            metadata: {
                                ...(result.metadata as Record<string, unknown> | undefined),
                                componentList: result.generation.componentList,
                                explanation: result.explanation,
                                plan: result.plan,
                                previewArtifact: result.generation.previewArtifact,
                            },
                            prompt: result.userPrompt,
                            source,
                            sourceType: result.metadata?.target === 'expo-rn' ? 'expo' : 'tsx',
                            title: typeof body.currentTitle === 'string' ? body.currentTitle : result.userPrompt,
                        });
                        result.projectId = saved.project.id;
                        result.version = saved.version.versionNumber;
                    } catch (error) {
                        console.error('[API /generate] Persistence error:', error);
                        result.version = currentVersion + 1;
                        result.projectId = typeof body.projectId === 'string' ? body.projectId : undefined;
                        result.persistenceWarning = 'Generated successfully, but it could not be saved to your project library.';
                    }
                    sendEvent({ type: 'complete', message: 'Generation complete', data: result });
                } catch (error) {
                    console.error('[API /generate] Stream error:', error);
                    sendEvent({ type: 'error', message: 'Generation could not be saved. Please try again.' });
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
        return apiError(error, '[/api/generate] Invalid request');
    }
}
