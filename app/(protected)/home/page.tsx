"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";

type HomeResponse = {
  recentErrors: {
    id: string;
    title: string;
    resolutionTime: number;
    createdAt: string;
    technologies: {
      id: string;
      name: string;
    }[];
  }[];
  totalErrorCount: number;
  technologyCounts: {
    id: string;
    name: string;
    count: number;
  }[];
  averageResolutionTime: number;
};

export default function Page() {
  const { token, isLoading: isSessionLoading } = useSupabaseSession();

  const [data, setData] = useState<HomeResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isSessionLoading || !token) return;

    const fetchHome = async () => {
      try {
        const response = await fetch("/api/home", {
          method: "GET",
          headers: {
            Authorization: token,
          },
        });

        

        if (!response.ok) {
          throw new Error("Home情報の取得に失敗しました");
        }

        const result: HomeResponse = await response.json();

        setData(result);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHome();
  }, [token, isSessionLoading]);

  // 平均解決時間を「○時間 ○分」に変換
  const formatResolutionTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    return {
      hours,
      minutes: remainingMinutes,
    };
  };

  // 日付を「7/30」のような形式に変換
  const formatDate = (date: string) => {
    const targetDate = new Date(date);

    return `${targetDate.getMonth() + 1}/${targetDate.getDate()}`;
  };

  if (isSessionLoading || isLoading) {
    return (
      <main className="min-h-screen bg-[#f8f9fa] flex items-center justify-center">
        <p className="text-gray-500">読み込み中...</p>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="min-h-screen bg-[#f8f9fa] flex items-center justify-center">
        <p className="text-gray-500">データの取得に失敗しました。</p>
      </main>
    );
  }

  const averageTime = formatResolutionTime(data.averageResolutionTime);

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-gray-900">
      <main className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* 統計・平均解決時間 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 統計 */}
            <section className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold mb-6">あなたの統計</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 総登録件数 */}
                <div className="border border-gray-200 rounded-xl p-6 flex flex-col justify-center items-center min-h-50">
                  <span className="text-sm text-gray-500 font-medium self-start mb-4">
                    総登録件数
                  </span>

                  <div className="flex items-baseline gap-2">
                    <span className="text-6xl font-black">
                      {data.totalErrorCount}
                    </span>

                    <span className="text-xl text-gray-500 font-medium">
                      件
                    </span>
                  </div>
                </div>

                {/* 技術別エラー */}
                <div className="flex flex-col justify-between">
                  <div>
                    <span className="text-sm text-gray-500 font-medium mb-4 block">
                      技術別エラー
                    </span>

                    {data.technologyCounts.length === 0 ? (
                      <p className="text-sm text-gray-500">
                        登録された技術はありません。
                      </p>
                    ) : (
                      <ul className="space-y-3">
                        {data.technologyCounts.map((technology) => (
                          <li
                            key={technology.id}
                            className="flex justify-between items-center text-sm"
                          >
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-indigo-600" />

                              <span className="font-medium">
                                {technology.name}
                              </span>
                            </div>

                            <span className="bg-gray-100 px-2 py-1 rounded text-gray-600">
                              {technology.count}件
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* エラー登録ボタン */}
                  <div className="mt-6 text-right">
                    <Link
                      href="/errors/new"
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-xl shadow-md transition-colors inline-flex items-center gap-2"
                    >
                      <span className="text-xl">+</span>
                      エラーを登録
                    </Link>
                  </div>
                </div>
              </div>
            </section>

            {/* 平均解決時間 */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col justify-center items-center text-center min-h-75">
              <div className="flex items-center gap-2 mb-6 text-gray-600">
                <span className="text-xl">◷</span>

                <h2 className="text-lg font-bold">全体の平均解決時間</h2>
              </div>

              {data.totalErrorCount === 0 ? (
                <p className="text-gray-500">
                  まだエラーが登録されていません。
                </p>
              ) : (
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-5xl font-bold text-indigo-600">
                    {averageTime.hours}
                  </span>

                  <span className="text-xl text-gray-500">時間</span>

                  <span className="text-5xl font-bold text-indigo-600 ml-2">
                    {averageTime.minutes}
                  </span>

                  <span className="text-xl text-gray-500">分</span>
                </div>
              )}
            </section>
          </div>

          {/* 最新のエラーログ */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <span className="text-xl text-gray-500">◷</span>

                <h2 className="text-xl font-bold">最新のエラーログ</h2>
              </div>

              <Link
                href="/errors"
                className="text-sm text-indigo-600 hover:underline font-medium"
              >
                一覧を表示
              </Link>
            </div>

            {data.recentErrors.length === 0 ? (
              <div className="py-10 text-center text-gray-500">
                <p>まだエラーログが登録されていません。</p>

                <Link
                  href="/errors/new"
                  className="inline-block mt-4 text-indigo-600 hover:underline"
                >
                  エラーを登録する
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {data.recentErrors.map((error) => (
                  <Link
                    key={error.id}
                    href={`/errors/${error.id}`}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-[#f8f9fa] rounded-xl border border-transparent hover:border-gray-300 transition-colors"
                  >
                    <div>
                      <h3 className="font-bold mb-2">{error.title}</h3>

                      <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
                        {error.technologies.map((technology) => (
                          <span
                            key={technology.id}
                            className="bg-gray-200 px-2 py-0.5 rounded text-xs font-medium"
                          >
                            {technology.name}
                          </span>
                        ))}

                        <span>{formatDate(error.createdAt)}</span>
                      </div>
                    </div>

                    <div className="mt-2 sm:mt-0 text-sm font-medium text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full self-start sm:self-auto">
                      解決時間:{" "}
                      {formatResolutionTime(error.resolutionTime).hours > 0
                        ? `${formatResolutionTime(error.resolutionTime).hours}時間`
                        : ""}
                      {formatResolutionTime(error.resolutionTime).minutes > 0
                        ? `${formatResolutionTime(error.resolutionTime).minutes}分`
                        : ""}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
