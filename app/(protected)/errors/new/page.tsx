'use client'

import  ErrorForm  from '@/app/_components/ErrorForm'
import { useCreateError } from '@/app/_hooks/useCreateError'
import { CreateErrorRequestBody } from '@/app/_types/Errors/CreateErrorRequestBody'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Page() {
  const router = useRouter()

  const { createError, isSubmitting } = useCreateError()

  const handleSubmit = async (values: CreateErrorRequestBody) => {
    try {
      const data = await createError(values)

      router.push(`/errors/${data.id}`)
    } catch (error) {
      console.error(error)
      alert('エラーの登録に失敗しました')
    }
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6">
        <Link
          href="/errors"
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          ← 一覧へ戻る
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          新規エラーログの登録
        </h1>

        <p className="mt-2 text-gray-600">
          発生したエラーと解決方法を記録しましょう。
        </p>
      </div>

      <ErrorForm
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </main>
  )
}
