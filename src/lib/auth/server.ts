import { auth } from '@clerk/nextjs/server';

export class AuthenticationError extends Error {
  readonly status = 401;

  constructor() {
    super('Sign in is required to use the generator.');
    this.name = 'AuthenticationError';
  }
}

export async function requireUserId(): Promise<string> {
  const hasClerkKeys = /^pk_(test|live)_[A-Za-z0-9]+$/.test(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || '')
    && /^sk_(test|live)_[A-Za-z0-9]+$/.test(process.env.CLERK_SECRET_KEY || '');
  if (!hasClerkKeys) {
    if (process.env.NODE_ENV !== 'production') return 'local-development';
    throw new AuthenticationError();
  }
  const { userId } = await auth();
  if (!userId) throw new AuthenticationError();
  return userId;
}
