// src/components/SessionWrapper.tsx
"use client"; // Make this a client-side component

import { SessionProvider } from "next-auth/react";

export default function SessionWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SessionProvider>{children}</SessionProvider>;
}
