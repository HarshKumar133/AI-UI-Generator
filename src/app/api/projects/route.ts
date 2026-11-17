import { NextRequest, NextResponse } from 'next/server';
import { requireUserId } from '@/lib/auth/server';
import { apiError } from '@/lib/api/errors';
import { listProjects, persistVersion, type PersistedSourceType } from '@/lib/db/repository';

export const dynamic = 'force-dynamic';

function isSourceType(value: unknown): value is PersistedSourceType {
  return value === 'tsx' || value === 'html' || value === 'expo';
}

export async function GET() {
  try {
    const ownerId = await requireUserId();
    const projects = await listProjects(ownerId);
    return NextResponse.json({ success: true, data: projects });
  } catch (error) {
    return apiError(error, '[/api/projects] Could not list projects');
  }
}

export async function POST(request: NextRequest) {
  try {
    const ownerId = await requireUserId();
    const body = await request.json();
    if (typeof body.title !== 'string' || typeof body.prompt !== 'string' || typeof body.source !== 'string' || !isSourceType(body.sourceType)) {
      return NextResponse.json({ success: false, error: 'title, prompt, source, and sourceType are required.' }, { status: 400 });
    }
    if (body.source.length > 1_000_000) {
      return NextResponse.json({ success: false, error: 'Source exceeds the 1 MB project limit.' }, { status: 413 });
    }

    const saved = await persistVersion(ownerId, {
      assistantMessage: typeof body.assistantMessage === 'string' ? body.assistantMessage.slice(0, 20_000) : undefined,
      metadata: body.metadata && typeof body.metadata === 'object' ? body.metadata as Record<string, unknown> : undefined,
      prompt: body.prompt.slice(0, 20_000),
      source: body.source,
      sourceType: body.sourceType,
      title: body.title,
    });
    return NextResponse.json({ success: true, data: saved }, { status: 201 });
  } catch (error) {
    return apiError(error, '[/api/projects] Could not create project');
  }
}
