import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { configureNeonFetch } from './neonFetch';
import * as schema from './schema';

export class DatabaseConfigurationError extends Error {
  readonly status = 503;

  constructor() {
    super('Database is not configured. Add DATABASE_URL to the server environment.');
    this.name = 'DatabaseConfigurationError';
  }
}

let database: ReturnType<typeof drizzle<typeof schema>> | undefined;

export function getDb() {
  if (database) return database;

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new DatabaseConfigurationError();

  configureNeonFetch();
  database = drizzle({ client: neon(connectionString), schema });
  return database;
}

export * from './schema';
