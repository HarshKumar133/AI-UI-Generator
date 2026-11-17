import { NextResponse } from 'next/server';
import { AuthenticationError } from '@/lib/auth/server';
import { DatabaseConfigurationError } from '@/lib/db';
import { ProjectAccessError, ProjectValidationError } from '@/lib/db/repository';

export function apiError(error: unknown, fallback: string): NextResponse {
  if (error instanceof AuthenticationError || error instanceof ProjectAccessError || error instanceof ProjectValidationError || error instanceof DatabaseConfigurationError) {
    return NextResponse.json({ success: false, error: error.message }, { status: error.status });
  }

  console.error(fallback, error);
  return NextResponse.json({ success: false, error: 'An unexpected server error occurred.' }, { status: 500 });
}
