"use client";

import Link from "next/link";
import { supabase } from "@/app/_libs/supabase";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Logo } from "./_components/Headers/Logo";

export default function Page() {
  const router = useRouter();
  const [isGuestLoading, setIsGuestLoading] = useState(false);

  const handleGuestLogin = async () => {
    try {
      setIsGuestLoading(true);

      const { error } = await supabase.auth.signInWithPassword({
        email: "guest@example.com",
        password: "guest12345",
      });

      if (error) {
        throw error;
      }

      router.push("/home");
    } catch (error) {
      console.error(error);
      alert("ゲストログインに失敗しました");
    } finally {
      setIsGuestLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          {/* Logo */}
          <Logo />

          {/* Navigation */}
          <nav className="flex items-center gap-4 sm:gap-6">
            <button
              type="button"
              onClick={handleGuestLogin}
              disabled={isGuestLoading}
              className="rounded-lg border border-indigo-200 bg-white px-5 py-2.5 font-medium text-indigo-600 transition-colors hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isGuestLoading ? "ログイン中..." : "ゲストログイン"}
            </button>
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
              アカウント作成
            </Link>
          </nav>
        </div>
      </header>

      <div className="relative overflow-hidden">
        {/* Background decoration */}
        <div className="pointer-events-none absolute left-1/2 top-24 z-0 -translate-x-1/2 whitespace-nowrap text-[15vw] font-extrabold text-gray-100">
          ErrorNote
        </div>

        {/* Hero */}
        <section className="relative z-10 mx-auto flex max-w-6xl flex-col items-center gap-12 px-6 py-20 md:flex-row md:py-32">
          {/* Hero Text */}
          <div className="flex-1 space-y-8">
            <div className="inline-flex rounded-full bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-600">
              エラー解決のナレッジ管理サービス
            </div>

            <h1 className="text-4xl font-bold leading-tight text-gray-900 md:text-5xl lg:text-6xl">
              エラーを
              <span className="text-indigo-600">知識</span>
              に変える。
            </h1>

            <p className="max-w-xl text-lg leading-relaxed text-gray-600">
              開発中に遭遇したエラーを、
              <br />
              「原因・試したこと・解決方法・学び」として記録。
              <br />
              さらに、エラー解決にかかった時間も残すことで、
              <br />
              過去の失敗を次の開発に活かせます。
            </p>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                href="/sign_up"
                className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-8 py-4 text-lg font-medium text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-lg"
              >
                今すぐ始める
              </Link>

              <Link
                href="/sign_in"
                className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-8 py-4 text-lg font-medium text-gray-700 shadow-sm transition-all hover:-translate-y-0.5 hover:border-indigo-200 hover:text-indigo-600"
              >
                ログイン
              </Link>

              <button
                type="button"
                onClick={handleGuestLogin}
                disabled={isGuestLoading}
                className="inline-flex items-center justify-center rounded-xl border border-indigo-200 bg-indigo-50 px-8 py-4 text-lg font-medium text-indigo-600 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-indigo-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isGuestLoading ? "ログイン中..." : "ゲストで試してみる"}
              </button>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="w-full max-w-lg flex-1">
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-2xl">
              {/* Mock Error Card */}
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    最近のエラー
                  </p>

                  <h2 className="mt-1 text-xl font-bold text-gray-900">
                    TypeScriptの型エラー
                  </h2>
                </div>

                <div className="rounded-lg bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-600">
                  25分
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="mb-1 text-xs font-semibold text-gray-500">
                    原因
                  </p>

                  <p className="text-sm text-gray-700">
                    APIレスポンスの型とコンポーネント側の型が一致していなかった。
                  </p>
                </div>

                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="mb-1 text-xs font-semibold text-gray-500">
                    解決方法
                  </p>

                  <p className="text-sm text-gray-700">
                    APIレスポンス用の型を定義して、フロント側で使用する型を統一。
                  </p>
                </div>

                <div className="rounded-xl bg-indigo-50 p-4">
                  <p className="mb-1 text-xs font-semibold text-indigo-600">
                    学び
                  </p>

                  <p className="text-sm text-gray-700">
                    APIとフロントエンドで型を明確に分けて管理する。
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {["Next.js", "TypeScript", "Prisma"].map((technology) => (
                  <span
                    key={technology}
                    className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600"
                  >
                    {technology}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="relative z-10 mx-auto max-w-6xl px-6 py-20">
          <div className="mb-16 space-y-4 text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600">
              Features
            </p>

            <h2 className="text-4xl font-bold text-gray-900">
              ErrorNoteでできること
            </h2>

            <p className="text-lg text-gray-600">
              エラー解決を「その場限り」で終わらせない。
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Feature 1 */}
            <div className="flex h-full flex-col rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <svg
                  className="h-7 w-7"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M12 20h9M12 4h9M4 9h16M4 15h16"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                </svg>
              </div>

              <h3 className="mb-4 text-xl font-bold leading-snug">
                エラー解決の過程を
                <br />
                構造化して記録
              </h3>

              <p className="grow text-sm leading-relaxed text-gray-600">
                エラーの原因、試したこと、解決方法、そこから得た学びを記録。
                場当たり的な対応ではなく、解決までの思考過程を残せます。
              </p>
            </div>

            {/* Feature 2 */}
            <div className="flex h-full flex-col rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <svg
                  className="h-7 w-7"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M4 19V5M4 19h16M8 16v-4M12 16V8M16 16v-7M20 16v-3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                </svg>
              </div>

              <h3 className="mb-4 text-xl font-bold leading-snug">
                デバッグ時間を
                <br />
                可視化
              </h3>

              <p className="grow text-sm leading-relaxed text-gray-600">
                エラー解決にかかった時間を記録。
                自分がどのようなエラーに時間を使っているのかを把握し、
                今後の開発効率の改善につなげられます。
              </p>
            </div>

            {/* Feature 3 */}
            <div className="flex h-full flex-col rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <svg
                  className="h-7 w-7"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M9 12l2 2 4-4m5.5-1.5a8 8 0 11-15 3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                </svg>
              </div>

              <h3 className="mb-4 text-xl font-bold leading-snug">
                試行錯誤を
                <br />
                「学び」として蓄積
              </h3>

              <p className="grow text-sm leading-relaxed text-gray-600">
                解決できた結果だけではなく、うまくいかなかった試行錯誤も記録。
                同じエラーに遭遇したとき、過去の経験をすぐに振り返れます。
              </p>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="relative z-10 bg-white">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <div className="mb-16 text-center">
              <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-indigo-600">
                How it works
              </p>

              <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
                エラーを記録して、次の開発へ
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {/* Step 1 */}
              <div className="text-center">
                <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-xl font-bold text-white">
                  1
                </div>

                <h3 className="mb-3 text-xl font-bold">エラーに遭遇</h3>

                <p className="text-sm leading-relaxed text-gray-600">
                  開発中に発生したエラーや問題を確認します。
                </p>
              </div>

              {/* Step 2 */}
              <div className="text-center">
                <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-xl font-bold text-white">
                  2
                </div>

                <h3 className="mb-3 text-xl font-bold">解決過程を記録</h3>

                <p className="text-sm leading-relaxed text-gray-600">
                  原因、試したこと、解決方法、学び、解決時間を記録します。
                </p>
              </div>

              {/* Step 3 */}
              <div className="text-center">
                <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-xl font-bold text-white">
                  3
                </div>

                <h3 className="mb-3 text-xl font-bold">次のエラーに活かす</h3>

                <p className="text-sm leading-relaxed text-gray-600">
                  過去の記録を振り返り、同じエラーや似た問題の解決に役立てます。
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="relative z-10 mx-auto max-w-5xl px-6 py-20 md:py-24">
          <div className="rounded-3xl border border-gray-200 bg-gray-100 px-8 py-16 text-center shadow-sm md:px-20">
            <h2 className="mb-6 text-3xl font-bold text-gray-900 md:text-4xl">
              エラー解決を、
              <br className="sm:hidden" />
              次の成長につなげよう。
            </h2>

            <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-gray-600">
              エラーに悩んだ時間を無駄にしない。
              <br />
              解決までの試行錯誤を、あなたの開発ナレッジとして残しましょう。
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/sign_up"
                className="inline-flex rounded-xl bg-indigo-600 px-10 py-4 text-lg font-medium text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-lg"
              >
                ErrorNoteを始める
              </Link>

              <button
                type="button"
                onClick={handleGuestLogin}
                disabled={isGuestLoading}
                className="inline-flex rounded-xl border border-indigo-200 bg-white px-10 py-4 text-lg font-medium text-indigo-600 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isGuestLoading ? "ログイン中..." : "ゲストで試してみる"}
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row">
          <p className="text-sm font-semibold text-gray-500">
            © 2026 ErrorNote
          </p>
        </div>
      </footer>
    </main>
  );
}
