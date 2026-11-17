import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/share(.*)',
  '/api/share(.*)',
]);

const clerkConfigured = /^pk_(test|live)_[A-Za-z0-9]+$/.test(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || '')
  && /^sk_(test|live)_[A-Za-z0-9]+$/.test(process.env.CLERK_SECRET_KEY || '');

const proxy = clerkConfigured
  ? clerkMiddleware(async (auth, request) => {
      if (!isPublicRoute(request)) await auth.protect();
    })
  : () => NextResponse.next();

export default proxy;

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
