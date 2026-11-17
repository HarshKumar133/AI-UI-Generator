'use client';

import { Show, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';

const buttonStyle = {
  background: 'transparent',
  border: '1px solid rgba(21, 18, 15, 0.14)',
  borderRadius: 999,
  color: '#433d37',
  cursor: 'pointer',
  font: '600 12px var(--font-sans)',
  padding: '6px 10px',
} as const;

export function AuthControls() {
  if (!/^pk_(test|live)_[A-Za-z0-9]+$/.test(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || '')) return null;
  return <ClerkAuthControls />;
}

function ClerkAuthControls() {
  return (
    <>
      <Show when="signed-out">
        <SignInButton mode="modal"><button style={buttonStyle}>Sign in</button></SignInButton>
        <SignUpButton mode="modal"><button style={{ ...buttonStyle, background: '#da4f2f', borderColor: '#da4f2f', color: '#fff' }}>Create account</button></SignUpButton>
      </Show>
      <Show when="signed-in">
        <UserButton />
      </Show>
    </>
  );
}
