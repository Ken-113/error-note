import useSWR from "swr";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { ErrorDetailResponse } from "@/app/_types/Errors/ErrorDetailResponse";


const fetcher = async ([url, token]: [string, string]) => {
  const response = await fetch(url, {
    headers: {
      Authorization: token,
    },
  });

  if (!response.ok) {
    throw new Error("エラー情報の取得に失敗しました");
  }

  return response.json();
};

export const useError = (id: string) => {
  const { token, isLoading: isSessionLoading } = useSupabaseSession();

  const { data, error, isLoading } = useSWR<ErrorDetailResponse>(
    token && id ? [`/api/errors/${id}`, token] : null,
    fetcher,
  );

  return {
    data,
    error,
    isLoading: isSessionLoading || isLoading,
  };
};
