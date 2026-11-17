import { NextRequest, NextResponse } from 'next/server';
import { requireUserId } from '@/lib/auth/server';
import { apiError } from '@/lib/api/errors';
import { deleteProject, getProjectDetail } from '@/lib/db/repository';

export const dynamic = 'force-dynamic';

interface RouteContext {
  params: Promise<{ projectId: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteContext) {
  try {
    const ownerId = await requireUserId();
    const { projectId } = await params;
    const project = await getProjectDetail(ownerId, projectId);
    return NextResponse.json({ success: true, data: project });
  } catch (error) {
    return apiError(error, '[/api/projects/:id] Could not load project');
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteContext) {
  try {
    const ownerId = await requireUserId();
    const { projectId } = await params;
    await deleteProject(ownerId, projectId);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return apiError(error, '[/api/projects/:id] Could not delete project');
  }
}
