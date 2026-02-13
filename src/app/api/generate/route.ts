import { NextRequest, NextResponse } from 'next/server';
import { orchestrateGeneration } from '@/lib/agents';
import { GenerateRequest, ApiResponse, GenerationResult } from '@/types';
import { getVersionHistory, addVersion } from '@/lib/store';

export async function POST(request: NextRequest) {
    try {
        const body: GenerateRequest = await request.json();

        if (!body.prompt || body.prompt.trim().length === 0) {
            return NextResponse.json<ApiResponse<null>>(
                { success: false, error: 'Prompt is required' },
                { status: 400 }
            );
        }

        const currentVersion = getVersionHistory().length;
        const result: GenerationResult = await orchestrateGeneration(body.prompt, currentVersion);

        // Store version
        addVersion({
            version: result.version,
            code: result.generation.code,
            prompt: result.userPrompt,
            plan: result.plan,
            explanation: result.explanation,
            timestamp: result.timestamp,
        });

        return NextResponse.json<ApiResponse<GenerationResult>>(
            { success: true, data: result },
            { status: 200 }
        );
    } catch (error) {
        console.error('[API /generate] Error:', error);
        return NextResponse.json<ApiResponse<null>>(
            { success: false, error: error instanceof Error ? error.message : 'Generation failed' },
            { status: 500 }
        );
    }
}