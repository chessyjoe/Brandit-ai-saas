"use client";

import { DemoApp, AuthProvider } from '@/components/DemoApp';

export default function Page() {
  return (
    <AuthProvider>
      <DemoApp />
    </AuthProvider>
  );
}
