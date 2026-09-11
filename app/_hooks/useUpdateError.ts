import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { UpdateErrorRequestBody } from "@/app/_types/Errors/UpdateErrorRequestBody";

export const useUpdateError = () => {
  const { token } = useSupabaseSession();
  

  const updateError = async (
    id: string,
    values: UpdateErrorRequestBody,
  ) => {
    if (!token) {
      throw new Error("ログイン情報を取得できませんでした");
    }

    try {
      

      const response = await fetch(`/api/errors/${id}`, {
        method: "PUT",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("エラー情報の更新に失敗しました");
      }

      return await response.json();
    } finally {
      
    }
  };

  return {
    updateError,
   
  };
};