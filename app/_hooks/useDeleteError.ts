import { useState } from "react";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";

export const useDeleteError = () => {
  const { token } = useSupabaseSession();
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteError = async (id: string) => {
    if (!token) {
      throw new Error("ログイン情報を取得できませんでした");
    }

    try {
      setIsDeleting(true);

      const response = await fetch(`/api/errors/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: token,
        },
      });

      if (!response.ok) {
        throw new Error("エラー情報の削除に失敗しました");
      }

      return await response.json();
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    deleteError,
    isDeleting,
  };
};