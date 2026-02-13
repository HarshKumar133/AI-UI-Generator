import { NextRequest, NextResponse } from 'next/server';
import { orchestrateModification } from '@/lib/agents';
import { ModifyRequest, ApiResponse, GenerationResult, VersionEntry } from '@/types';

// Shared store — in production, use Supabase
// For now we use a module-level import pattern
import { getVersionHistory, addVersion } from '../_store';

export async function POST(request: NextRequest) {
  try {
    const body: ModifyRequest = await request.json();

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

    const result: GenerationResult = await orchestrateModification(body);

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
    console.error('[API /modify] Error:', error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: error instanceof Error ? error.message : 'Modification failed' },
      { status: 500 }
    );
  }
}