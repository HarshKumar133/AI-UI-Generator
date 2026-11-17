import { index, integer, jsonb, pgTable, text, timestamp, uniqueIndex, uuid, boolean } from 'drizzle-orm/pg-core';

export const projects = pgTable(
  'projects',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    ownerId: text('owner_id').notNull(),
    title: text('title').notNull(),
    sourceType: text('source_type').notNull().default('tsx'),
    currentVersion: integer('current_version').notNull().default(0),
    shareEnabled: boolean('share_enabled').notNull().default(false),
    shareToken: uuid('share_token').unique(),
    createdAt: timestamp('created_at', { mode: 'date', withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'date', withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('projects_owner_updated_idx').on(table.ownerId, table.updatedAt),
    uniqueIndex('projects_share_token_idx').on(table.shareToken),
  ],
);

export const projectVersions = pgTable(
  'project_versions',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    projectId: uuid('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
    versionNumber: integer('version_number').notNull(),
    prompt: text('prompt').notNull(),
    source: text('source').notNull(),
    sourceType: text('source_type').notNull(),
    metadata: jsonb('metadata').notNull().default({}),
    createdAt: timestamp('created_at', { mode: 'date', withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex('project_versions_project_number_idx').on(table.projectId, table.versionNumber),
    index('project_versions_project_created_idx').on(table.projectId, table.createdAt),
  ],
);

export const projectMessages = pgTable(
  'project_messages',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    projectId: uuid('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
    role: text('role').notNull(),
    content: text('content').notNull(),
    createdAt: timestamp('created_at', { mode: 'date', withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index('project_messages_project_created_idx').on(table.projectId, table.createdAt)],
);

export type Project = typeof projects.$inferSelect;
export type ProjectVersion = typeof projectVersions.$inferSelect;
export type ProjectMessage = typeof projectMessages.$inferSelect;
