import { useSupabaseSession } from '@/app/_hooks/useSupabaseSession'
import { CreateErrorRequestBody } from '@/app/_types/Errors/CreateErrorRequestBody'
import { CreateErrorResponse } from '@/app/_types/Errors/CreateErrorResponse'
import { useState } from 'react'

export const useCreateError = () => {
  const { token } = useSupabaseSession()

  const [isSubmitting, setIsSubmitting] = useState(false)

  const createError = async (
    values: CreateErrorRequestBody,
  ): Promise<CreateErrorResponse> => {
    if (!token) {
      throw new Error('認証情報が取得できませんでした')
    }

    try {
      setIsSubmitting(true)

      const response = await fetch('/api/errors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        throw new Error('エラーの登録に失敗しました')
      }

      return await response.json()
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    createError,
    isSubmitting,
  }
}
