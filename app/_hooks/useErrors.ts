import useSWR from 'swr'
import { useSupabaseSession } from '@/app/_hooks/useSupabaseSession'
import { ErrorsIndexResponse } from '@/app/_types/Errors/ErrorsIndexResponse'

const fetcher = async ([url, token]: [string, string]) => {
  const response = await fetch(url, {
    headers: {
      Authorization: token,
    },
  })

  if (!response.ok) {
    throw new Error('エラー一覧の取得に失敗しました')
  }

  return response.json()
}

export const useErrors = () => {
  const { token, isLoading: isSessionLoading } = useSupabaseSession()

  const { data, error, isLoading } = useSWR<ErrorsIndexResponse>(
    token ? ['/api/errors', token] : null,
    fetcher,
  )

  return {
    data,
    error,
    isLoading: isSessionLoading || isLoading,
  }
}