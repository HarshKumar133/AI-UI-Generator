import { NextRequest, NextResponse } from 'next/server';
import { orchestrateModification } from '@/lib/agents';
import { ApiResponse, GenerationResult } from '@/types';
import { addVersion } from '../_store';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

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
      currentVersion: body.currentVersion || 0,
      previousLayout: body.previousLayout,
      previousComponentList: body.previousComponentList,
    });

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
    console.error('[API /modify] Error:', error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: error instanceof Error ? error.message : 'Modification failed' },
      { status: 500 }
    );
  }
}