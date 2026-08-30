"use client";

import { useRouteGuard } from "@/app/_hooks/useRouteGuard";
import { Header } from "@/app/_components/Header";

export default function Layout({ children }: { children: React.ReactNode }) {
  useRouteGuard();

  return (
    <html lang="ja">
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}
