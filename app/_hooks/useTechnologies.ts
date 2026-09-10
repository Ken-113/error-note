import { useSupabaseSession } from '@/app/_hooks/useSupabaseSession'
import { TechnologiesIndexResponse } from '@/app/_types/Technologies/TechnologiesIndexResponse'
import useSWR from 'swr'

const fetcher = async ([url, token]: [string, string]) => {
  const response = await fetch(url, {
    headers: {
      Authorization: token,
    },
  })

  if (!response.ok) {
    throw new Error('技術一覧の取得に失敗しました')
  }

  return response.json()
}

export const useTechnologies = () => {
  const { token, isLoading: isSessionLoading } = useSupabaseSession()

  const { data, error, isLoading } = useSWR<TechnologiesIndexResponse>(
    token ? ['/api/technologies', token] : null,
    fetcher,
  )

  return {
    technologies: data?.technologies ?? [],
    error,
    isLoading: isSessionLoading || isLoading,
  }
}