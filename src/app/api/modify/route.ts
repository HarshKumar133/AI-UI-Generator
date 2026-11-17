import { NextRequest, NextResponse } from 'next/server';
import { orchestrateModification } from '@/lib/agents';
import { ApiResponse, GenerationResult } from '@/types';
import { normalizeConversationContext } from '@/lib/agents/conversationContext';
import { requireUserId } from '@/lib/auth/server';
import { apiError } from '@/lib/api/errors';
import { persistVersion } from '@/lib/db/repository';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const ownerId = await requireUserId();

        if (!body.prompt || body.prompt.trim().length === 0) {
            return NextResponse.json<ApiResponse<null>>(
                { success: false, error: 'Modification prompt is required' },
                { status: 400 }
            );
        }

        if (!body.currentCode) {
            return NextResponse.json<ApiResponse<null>>(
                { success: false, error: 'Current code is required for modification' },
                { status: 400 }
            );
        }

        const result: GenerationResult = await orchestrateModification({
            prompt: body.prompt,
            currentCode: body.currentCode,
            conversationContext: normalizeConversationContext(body.conversationContext),
            currentTitle: typeof body.currentTitle === 'string' ? body.currentTitle.slice(0, 120) : undefined,
            currentVersion: body.currentVersion || 0,
            generationMode: body.generationMode,
            targetPreference: body.targetPreference,
            previousTarget: body.previousTarget,
            previousMode: body.previousMode,
            previousLayout: body.previousLayout,
            previousComponentList: body.previousComponentList,
        });
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
            console.error('[API /modify] Persistence error:', error);
            result.version = (Number.isInteger(body.currentVersion) ? body.currentVersion : 0) + 1;
            result.projectId = typeof body.projectId === 'string' ? body.projectId : undefined;
            result.persistenceWarning = 'Generated successfully, but it could not be saved to your project library.';
        }
        return NextResponse.json<ApiResponse<GenerationResult>>(
            { success: true, data: result },
            { status: 200 }
        );
    } catch (error) {
        return apiError(error, '[/api/modify] Modification failed');
    }
}
