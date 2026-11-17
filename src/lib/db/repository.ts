import { and, asc, desc, eq, sql } from 'drizzle-orm';
import { getDb } from './index';
import { projectMessages, projects, projectVersions, type Project, type ProjectMessage, type ProjectVersion } from './schema';

export type PersistedSourceType = 'tsx' | 'html' | 'expo';

export interface PersistVersionInput {
  assistantMessage?: string;
  metadata?: Record<string, unknown>;
  projectId?: string;
  prompt: string;
  source: string;
  sourceType: PersistedSourceType;
  title: string;
}

export interface ProjectDetail {
  messages: ProjectMessage[];
  project: Project;
  version: ProjectVersion | undefined;
  versions: ProjectVersion[];
}

export class ProjectAccessError extends Error {
  readonly status: number;

  constructor(message = 'Project not found', status = 404) {
    super(message);
    this.name = 'ProjectAccessError';
    this.status = status;
  }
}

export class ProjectValidationError extends Error {
  readonly status = 400;

  constructor(message: string) {
    super(message);
    this.name = 'ProjectValidationError';
  }
}

const MAX_SOURCE_LENGTH = 1_000_000;
const MAX_PROMPT_LENGTH = 20_000;
const MAX_ASSISTANT_MESSAGE_LENGTH = 20_000;

function normalizeTitle(value: string): string {
  const title = value.trim().replace(/\s+/g, ' ');
  return title.slice(0, 120) || 'Untitled project';
}

function assertProjectId(value: string): void {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)) {
    throw new ProjectValidationError('Invalid project identifier.');
  }
}

function assertPersistInput(input: PersistVersionInput): void {
  if (!input.prompt.trim()) throw new ProjectValidationError('A project prompt is required.');
  if (!input.source.trim()) throw new ProjectValidationError('Generated source cannot be empty.');
  if (input.prompt.length > MAX_PROMPT_LENGTH) throw new ProjectValidationError('Prompt exceeds the 20,000 character limit.');
  if (input.source.length > MAX_SOURCE_LENGTH) throw new ProjectValidationError('Source exceeds the 1 MB project limit.');
  if (input.assistantMessage && input.assistantMessage.length > MAX_ASSISTANT_MESSAGE_LENGTH) {
    throw new ProjectValidationError('Assistant message exceeds the 20,000 character limit.');
  }
  if (input.projectId) assertProjectId(input.projectId);
}

async function assertOwner(projectId: string, ownerId: string): Promise<Project> {
  const db = getDb();
  const [project] = await db
    .select()
    .from(projects)
    .where(and(eq(projects.id, projectId), eq(projects.ownerId, ownerId)))
    .limit(1);

  if (!project) throw new ProjectAccessError();
  return project;
}

export async function listProjects(ownerId: string): Promise<Project[]> {
  return getDb()
    .select()
    .from(projects)
    .where(eq(projects.ownerId, ownerId))
    .orderBy(desc(projects.updatedAt));
}

export async function getProjectDetail(ownerId: string, projectId: string): Promise<ProjectDetail> {
  assertProjectId(projectId);
  const project = await assertOwner(projectId, ownerId);
  const db = getDb();
  const [version] = await db
    .select()
    .from(projectVersions)
    .where(and(eq(projectVersions.projectId, project.id), eq(projectVersions.versionNumber, project.currentVersion)))
    .limit(1);
  const messages = await db
    .select()
    .from(projectMessages)
    .where(eq(projectMessages.projectId, project.id))
    .orderBy(asc(projectMessages.createdAt));
  const versions = await db
    .select()
    .from(projectVersions)
    .where(eq(projectVersions.projectId, project.id))
    .orderBy(asc(projectVersions.versionNumber));

  return { messages, project, version, versions };
}

export async function persistVersion(ownerId: string, input: PersistVersionInput): Promise<{ project: Project; version: ProjectVersion }> {
  assertPersistInput(input);
  const db = getDb();
  const now = new Date();
  const metadata = input.metadata ?? {};
  let project: Project;

  if (input.projectId) {
    const [updatedProject] = await db
      .update(projects)
      .set({
        currentVersion: sql`${projects.currentVersion} + 1`,
        sourceType: input.sourceType,
        title: normalizeTitle(input.title),
        updatedAt: now,
      })
      .where(and(eq(projects.id, input.projectId), eq(projects.ownerId, ownerId)))
      .returning();
    if (!updatedProject) throw new ProjectAccessError();
    project = updatedProject;
  } else {
    const [createdProject] = await db
      .insert(projects)
      .values({
        currentVersion: 1,
        ownerId,
        sourceType: input.sourceType,
        title: normalizeTitle(input.title),
        updatedAt: now,
      })
      .returning();
    if (!createdProject) throw new Error('Could not create project');
    project = createdProject;
  }

  const [version] = await db
    .insert(projectVersions)
    .values({
      metadata,
      projectId: project.id,
      prompt: input.prompt,
      source: input.source,
      sourceType: input.sourceType,
      versionNumber: project.currentVersion,
    })
    .returning();
  if (!version) throw new Error('Could not save project version');

  await db.insert(projectMessages).values([
    { content: input.prompt, projectId: project.id, role: 'user' },
    ...(input.assistantMessage ? [{ content: input.assistantMessage, projectId: project.id, role: 'assistant' }] : []),
  ]);

  return { project, version };
}

export async function enableSharing(ownerId: string, projectId: string): Promise<Project> {
  assertProjectId(projectId);
  const db = getDb();
  const [project] = await db
    .update(projects)
    .set({ shareEnabled: true, shareToken: crypto.randomUUID(), updatedAt: new Date() })
    .where(and(eq(projects.id, projectId), eq(projects.ownerId, ownerId)))
    .returning();
  if (!project) throw new ProjectAccessError();
  return project;
}

export async function disableSharing(ownerId: string, projectId: string): Promise<void> {
  assertProjectId(projectId);
  const db = getDb();
  const [project] = await db
    .update(projects)
    .set({ shareEnabled: false, shareToken: null, updatedAt: new Date() })
    .where(and(eq(projects.id, projectId), eq(projects.ownerId, ownerId)))
    .returning({ id: projects.id });
  if (!project) throw new ProjectAccessError();
}

export async function deleteProject(ownerId: string, projectId: string): Promise<void> {
  assertProjectId(projectId);
  const db = getDb();
  const [project] = await db
    .delete(projects)
    .where(and(eq(projects.id, projectId), eq(projects.ownerId, ownerId)))
    .returning({ id: projects.id });
  if (!project) throw new ProjectAccessError();
}

export async function renameProject(ownerId: string, projectId: string, title: string): Promise<Project> {
  assertProjectId(projectId);
  const normalizedTitle = normalizeTitle(title);
  const db = getDb();
  const [project] = await db
    .update(projects)
    .set({ title: normalizedTitle, updatedAt: new Date() })
    .where(and(eq(projects.id, projectId), eq(projects.ownerId, ownerId)))
    .returning();
  if (!project) throw new ProjectAccessError();
  return project;
}

export async function getSharedProject(token: string): Promise<{ project: Project; version: ProjectVersion }> {
  assertProjectId(token);
  const db = getDb();
  const [project] = await db
    .select()
    .from(projects)
    .where(and(eq(projects.shareToken, token), eq(projects.shareEnabled, true)))
    .limit(1);
  if (!project) throw new ProjectAccessError('Shared project not found');

  const [version] = await db
    .select()
    .from(projectVersions)
    .where(and(eq(projectVersions.projectId, project.id), eq(projectVersions.versionNumber, project.currentVersion)))
    .limit(1);
  if (!version) throw new ProjectAccessError('Shared project has no version');

  return { project, version };
}
