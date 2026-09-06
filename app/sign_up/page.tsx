"use client";

import { supabase } from "@/app/_libs/supabase";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { AuthForm } from "@/app/_types/AuthForm";
import {AuthHeader} from "../_components/Headers/AuthHeader";

export default function Page() {
  
  const [showPassword, setShowPassword] = useState(false);
 const {
   register,
   handleSubmit,
   reset,
   formState: { errors,isSubmitting,  },
 } = useForm<AuthForm>();


  const onSubmit = async (data: AuthForm) => {
    

    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/sign_in`,
      },
    });

     if (error) {
      alert("登録に失敗しました");
    } else {
      reset();
      alert("確認メールを送信しました。");
    }

    
  };

  return (
    <div className="min-h-screen flex flex-col">
      <AuthHeader />

      <main className="grow flex items-center justify-center p-6 bg-[#f8f9fa]">
        <div className="bg-white w-full max-w-md rounded-lg shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-gray-100 p-10">
          <h1 className="text-2xl font-bold mb-8 text-center text-gray-800 tracking-tight">
            アカウントを作成
          </h1>

          <form onSubmit={handleSubmit(onSubmit)}  className="w-full space-y-6">
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
                placeholder="developer@example.com"
                className="block w-full rounded border border-gray-300 py-2.5 px-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 sm:text-sm transition-colors duration-200 disabled:bg-gray-100"
                
                {...register("email", {
                  required: "メールアドレスを入力してください",
                })}
                disabled={isSubmitting}
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
                  className="block w-full rounded border border-gray-300 py-2.5 pl-3 pr-10 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 sm:text-sm transition-colors duration-200 disabled:bg-gray-100"
                  
                  {...register("password", {
                    required: "パスワードを入力してください",
                  })}
                  disabled={isSubmitting}
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.password.message}
                  </p>
                )}

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isSubmitting}
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
                disabled={isSubmitting}
                className="w-full flex justify-center py-2.5 px-4 rounded text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 transition-colors duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "登録中..." : "アカウントを作成"}
              </button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              すでにアカウントをお持ちですか？
            </p>

            <Link
              href="/sign_in"
              className="inline-block mt-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors duration-200"
            >
              ログイン
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
