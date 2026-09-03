"use client";

import { useRouteGuard } from "@/app/_hooks/useRouteGuard";
import { Header } from "@/app/_components/Headers/ProtectedHeader";

export default function Layout({ children }: { children: React.ReactNode }) {
  useRouteGuard();

  return (
    <>
      <Header />
      {children}
    </>
  );
}
