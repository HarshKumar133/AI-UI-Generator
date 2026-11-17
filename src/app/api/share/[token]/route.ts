import { NextRequest, NextResponse } from 'next/server';
import { apiError } from '@/lib/api/errors';
import { getSharedProject } from '@/lib/db/repository';

export const dynamic = 'force-dynamic';

interface RouteContext {
  params: Promise<{ token: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteContext) {
  try {
    const { token } = await params;
    const { project, version } = await getSharedProject(token);
    return NextResponse.json({
      success: true,
      data: {
        project: {
          id: project.id,
          sourceType: project.sourceType,
          title: project.title,
          updatedAt: project.updatedAt,
        },
        version: {
          createdAt: version.createdAt,
          metadata: version.metadata,
          source: version.source,
          sourceType: version.sourceType,
          versionNumber: version.versionNumber,
        },
      },
    });
  } catch (error) {
    return apiError(error, '[/api/share/:token] Could not load shared project');
  }
}
