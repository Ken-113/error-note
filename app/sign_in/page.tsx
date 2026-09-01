"use client";

import { supabase } from "@/app/_libs/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { AuthForm } from "@/app/_types/AuthForm";


export default function Page() {
  
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isLoading },
  } = useForm<AuthForm>();

  const onSubmit = async (data: AuthForm) => {
    

    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      alert("ログインに失敗しました");
    } else {
      router.replace("/home");
    }

    
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9fa] font-sans antialiased text-gray-900">
      <header className="w-full bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto w-full">
          <Link
            href="/"
            className="text-2xl font-bold text-indigo-600 tracking-tight"
          >
            ErrorNote
          </Link>
        </div>
      </header>

      <main className="grow flex items-center justify-center p-6 bg-[#f8f9fa]">
        <div className="bg-white w-full max-w-md rounded-lg shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-gray-100 p-10">
          <h1 className="text-2xl font-bold mb-8 text-center text-gray-800 tracking-tight">
            おかえりなさい
          </h1>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 w-full max-w-100"
          >
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                メールアドレス
              </label>

              <input
                type="email"
                id="email"
                className="block w-full rounded border border-gray-300 py-2.5 px-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 sm:text-sm transition-colors duration-200 disabled:bg-gray-100"
                placeholder="name@company.com"
                disabled={isLoading}
                {...register("email", {
                  required: "メールアドレスを入力してください",
                })}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                パスワード
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="••••••••"
                  className="block w-full rounded border border-gray-300 py-2.5 px-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 sm:text-sm transition-colors duration-200 disabled:bg-gray-100"
                  disabled={isLoading}
                  {...register("password", {
                    required: "パスワードを入力してください",
                  })}
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.password.message}
                  </p>
                )}

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  aria-label={
                    showPassword ? "パスワードを非表示" : "パスワードを表示"
                  }
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 focus:outline-none disabled:cursor-not-allowed"
                >
                  {showPassword ? "●" : "○"}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2.5 px-4 rounded text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 transition-colors duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "ログイン中..." : "ログイン"}
              </button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <Link
              href="/sign_up"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors duration-200"
            >
              新規アカウント作成
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
