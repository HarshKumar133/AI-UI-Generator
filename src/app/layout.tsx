import type { Metadata } from "next";
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
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}