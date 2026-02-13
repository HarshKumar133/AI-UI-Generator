import { NextRequest, NextResponse } from 'next/server';
import { RollbackRequest, ApiResponse, VersionEntry } from '@/types';
import { getVersionHistory } from '@/lib/store';

export async function POST(request: NextRequest) {
    try {
        const body: RollbackRequest = await request.json();
        const versions = getVersionHistory();

        const targetVersion = versions.find(v => v.version === body.targetVersion);

        if (!targetVersion) {
            return NextResponse.json<ApiResponse<null>>(
                { success: false, error: `Version ${body.targetVersion} not found` },
                { status: 404 }
            );
        }

        return NextResponse.json<ApiResponse<VersionEntry>>(
            { success: true, data: targetVersion },
            { status: 200 }
        );
    } catch (error: unknown) {
        console.error('[API /rollback] Error:', error);
        return NextResponse.json<ApiResponse<null>>(
            { success: false, error: 'Rollback failed' },
            { status: 500 }
        );
    }
}