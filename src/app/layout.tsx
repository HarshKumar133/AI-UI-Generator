import type { Metadata } from "next";
import { ClerkProvider } from '@clerk/nextjs';
import "./globals.css";

export const metadata: Metadata = {
  title: "Deterministic UI Generator",
  description:
    "AI-powered UI generator using a fixed, deterministic component library. Convert natural language to working UI code.",
  keywords: ["UI Generator", "AI", "Deterministic", "Component Library", "React"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const clerkConfigured = /^pk_(test|live)_[A-Za-z0-9]+$/.test(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || '');
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        {clerkConfigured ? <ClerkProvider dynamic>{children}</ClerkProvider> : children}
      </body>
    </html>
  );
}
