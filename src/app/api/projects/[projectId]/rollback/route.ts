import { NextRequest, NextResponse } from 'next/server';
import { requireUserId } from '@/lib/auth/server';
import { apiError } from '@/lib/api/errors';
import { getProjectDetail, persistVersion, ProjectValidationError, type PersistedSourceType } from '@/lib/db/repository';

export const dynamic = 'force-dynamic';

interface RouteContext {
  params: Promise<{ projectId: string }>;
}

function isSourceType(value: string): value is PersistedSourceType {
  return value === 'tsx' || value === 'html' || value === 'expo';
}

export async function POST(request: NextRequest, { params }: RouteContext) {
  try {
    const ownerId = await requireUserId();
    const { projectId } = await params;
    const body = await request.json();
    const targetVersion = body.targetVersion;

    if (!Number.isInteger(targetVersion) || targetVersion < 1) {
      throw new ProjectValidationError('A valid version number is required.');
    }

    const detail = await getProjectDetail(ownerId, projectId);
    const snapshot = detail.versions.find((version) => version.versionNumber === targetVersion);
    if (!snapshot || !isSourceType(snapshot.sourceType)) {
      throw new ProjectValidationError('That version cannot be restored.');
    }

    const saved = await persistVersion(ownerId, {
      assistantMessage: `Restored version ${targetVersion}.`,
      metadata: snapshot.metadata as Record<string, unknown>,
      projectId,
      prompt: `Restored version ${targetVersion}: ${snapshot.prompt}`,
      source: snapshot.source,
      sourceType: snapshot.sourceType,
      title: detail.project.title,
    });

    return NextResponse.json({ success: true, data: saved });
  } catch (error) {
    return apiError(error, '[/api/projects/:id/rollback] Could not restore project version');
  }
}
