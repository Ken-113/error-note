import useSWR from 'swr'
import { useSupabaseSession } from '@/app/_hooks/useSupabaseSession'
import { HomeResponse } from '@/app/_types/HomeResponse'

const fetcher = async ([url, token]: [string, string]) => {
  const response = await fetch(url, {
    headers: {
      Authorization: token,
    },
  })

  if (!response.ok) {
    throw new Error('Home情報の取得に失敗しました')
  }

  return response.json()
}

export const useHome = () => {
  const { token, isLoading: isSessionLoading } = useSupabaseSession()

  const { data, error, isLoading } = useSWR<HomeResponse>(
    token ? ['/api/home', token] : null,
    fetcher,
  )

  return {
    data,
    error,
    isLoading: isSessionLoading || isLoading,
  }
}