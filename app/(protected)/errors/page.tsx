'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { useErrors } from '@/app/_hooks/useErrors'
import { ErrorsIndexResponse } from '@/app/_types/Errors/ErrorsIndexResponse'


const EMPTY_ERRORS: ErrorsIndexResponse['errors'] = []

export default function Page() {
  const { data, error, isLoading } = useErrors()

  const [keyword, setKeyword] = useState('')
  const [selectedTechnology, setSelectedTechnology] = useState('all')
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest')

  const errors = data?.errors ?? EMPTY_ERRORS

  // 一覧に存在する技術を取得
  const technologies = useMemo(() => {
    const technologyMap = new Map<string, string>()

    errors.forEach((error) => {
      error.technologies.forEach((technology) => {
        technologyMap.set(technology.id, technology.name)
      })
    })

    return Array.from(technologyMap.entries()).map(([id, name]) => ({
      id,
      name,
    }))
  }, [errors])

  // 検索・技術フィルター・並び順を適用
  const filteredErrors = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase()

    const result = errors.filter((error) => {
      const matchesKeyword =
        normalizedKeyword === '' ||
        error.title.toLowerCase().includes(normalizedKeyword)

      const matchesTechnology =
        selectedTechnology === 'all' ||
        error.technologies.some(
          (technology) => technology.id === selectedTechnology,
        )

      return matchesKeyword && matchesTechnology
    })

    return [...result].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime()
      const dateB = new Date(b.createdAt).getTime()

      return sortOrder === 'newest'
        ? dateB - dateA
        : dateA - dateB
    })
  }, [errors, keyword, selectedTechnology, sortOrder])

  if (isLoading) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="flex min-h-80 items-center justify-center">
          <p className="text-sm text-gray-500">
            エラー一覧を読み込んでいます...
          </p>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
          <p className="font-medium text-red-700">
            エラー一覧の取得に失敗しました
          </p>
          <p className="mt-2 text-sm text-red-600">
            時間をおいて、もう一度お試しください。
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* ページタイトル */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            エラー一覧
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            過去に記録したエラーを振り返りましょう。
          </p>
        </div>

        <Link
          href="/errors/new"
          className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700"
        >
          ＋ エラーを登録
        </Link>
      </div>

      {/* 検索・フィルター */}
      <section className="mb-8 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row">
          {/* キーワード検索 */}
          <div className="relative flex-1">
            <label htmlFor="keyword" className="sr-only">
              キーワード検索
            </label>

            <input
              id="keyword"
              type="text"
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="エラータイトルを検索..."
              className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          {/* 技術フィルター */}
          <div className="w-full lg:w-52">
            <label htmlFor="technology" className="sr-only">
              技術で絞り込む
            </label>

            <select
              id="technology"
              value={selectedTechnology}
              onChange={(event) => setSelectedTechnology(event.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
            >
              <option value="all">すべての技術</option>

              {technologies.map((technology) => (
                <option key={technology.id} value={technology.id}>
                  {technology.name}
                </option>
              ))}
            </select>
          </div>

          {/* 並び順 */}
          <div className="w-full lg:w-40">
            <label htmlFor="sort" className="sr-only">
              並び順
            </label>

            <select
              id="sort"
              value={sortOrder}
              onChange={(event) =>
                setSortOrder(
                  event.target.value as 'newest' | 'oldest',
                )
              }
              className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
            >
              <option value="newest">新しい順</option>
              <option value="oldest">古い順</option>
            </select>
          </div>
        </div>
      </section>

      {/* 件数 */}
      <div className="mb-4">
        <p className="text-sm text-gray-500">
          {filteredErrors.length}件のエラー
        </p>
      </div>

      {/* エラー一覧 */}
      {filteredErrors.length === 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm">
          <p className="font-medium text-gray-700">
            該当するエラーがありません
          </p>

          <p className="mt-2 text-sm text-gray-500">
            検索条件を変更するか、新しいエラーを登録してください。
          </p>
        </section>
      ) : (
        <div className="space-y-4">
          {filteredErrors.map((error) => (
            <article
              key={error.id}
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md sm:p-6"
            >
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0 flex-1">
                  {/* 技術タグ */}
                  <div className="mb-3 flex flex-wrap gap-2">
                    {error.technologies.map((technology) => (
                      <span
                        key={technology.id}
                        className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700"
                      >
                        {technology.name}
                      </span>
                    ))}
                  </div>

                  {/* タイトル */}
                  <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
                    {error.title}
                  </h2>

                  {/* メタ情報 */}
                  <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-gray-500">
                    <span>
                      登録日：{formatDate(error.createdAt)}
                    </span>

                    <span>
                      解決時間：{formatResolutionTime(error.resolutionTime)}
                    </span>
                  </div>
                </div>

                {/* 詳細ボタン */}
                <Link
                  href={`/errors/${error.id}`}
                  className="inline-flex shrink-0 items-center justify-center rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900"
                >
                  詳細を見る
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  )
}

const formatDate = (date: string) => {
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  }).format(new Date(date))
}

const formatResolutionTime = (minutes: number) => {
  if (minutes < 60) {
    return `${minutes}分`
  }

  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60

  if (remainingMinutes === 0) {
    return `${hours}時間`
  }

  return `${hours}時間${remainingMinutes}分`
}