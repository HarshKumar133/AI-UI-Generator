import { NextRequest, NextResponse } from 'next/server';
import { requireUserId } from '@/lib/auth/server';
import { apiError } from '@/lib/api/errors';
import { disableSharing, enableSharing } from '@/lib/db/repository';

export const dynamic = 'force-dynamic';

interface RouteContext {
  params: Promise<{ projectId: string }>;
}

export async function POST(_request: NextRequest, { params }: RouteContext) {
  try {
    const ownerId = await requireUserId();
    const { projectId } = await params;
    const project = await enableSharing(ownerId, projectId);
    return NextResponse.json({ success: true, data: { shareToken: project.shareToken } });
  } catch (error) {
    return apiError(error, '[/api/projects/:id/share] Could not enable sharing');
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteContext) {
  try {
    const ownerId = await requireUserId();
    const { projectId } = await params;
    await disableSharing(ownerId, projectId);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return apiError(error, '[/api/projects/:id/share] Could not disable sharing');
  }
}
