import { NextResponse } from 'next/server';
import { ApiResponse, VersionEntry } from '@/types';
import { getVersionHistory } from '@/lib/store';

export async function GET() {
    try {
        const versions = getVersionHistory();

        return NextResponse.json<ApiResponse<VersionEntry[]>>(
            { success: true, data: versions },
            { status: 200 }
        );
    } catch (error: unknown) {
        console.error('[API /versions] Error:', error);
        return NextResponse.json<ApiResponse<null>>(
            { success: false, error: 'Failed to fetch versions' },
            { status: 500 }
        );
    }
}