import type { Config } from 'drizzle-kit';

export default {
  dialect: 'postgresql',
  out: './drizzle',
  schema: './src/lib/db/schema.ts',
  dbCredentials: {
    url: process.env.DATABASE_URL ?? 'postgresql://placeholder:placeholder@localhost:5432/placeholder',
  },
} satisfies Config;
