"use client";

import Link from "next/link";
import React from "react";
import { useSupabaseSession } from "../../_hooks/useSupabaseSession";
import { supabase } from "../../_libs/supabase";
import { useRouter } from "next/navigation";
import { LogoLogin } from "./LogoLogin";

export const Header: React.FC = () => {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    await router.replace("/");
  };

  const { session, isLoading } = useSupabaseSession();

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <LogoLogin />

        {!isLoading && (
          <nav className="flex items-center gap-4 sm:gap-6">
            {session ? (
              <>
                <Link
                  href="/home"
                  className="font-medium text-gray-700 transition-colors hover:text-indigo-600"
                >
                  ホーム
                </Link>

                <button
                  onClick={handleLogout}
                  className="font-medium text-gray-700 transition-colors hover:text-indigo-600"
                >
                  ログアウト
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/sign_in"
                  className="font-medium text-gray-700 transition-colors hover:text-indigo-600"
                >
                  ログイン
                </Link>

                <Link
                  href="/sign_up"
                  className="rounded-lg bg-indigo-600 px-5 py-2.5 font-medium text-white shadow-sm transition-colors hover:bg-indigo-700"
                >
                  新規登録
                </Link>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};
