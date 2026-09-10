"use client";

import { use } from "react";
import { useError } from "@/app/_hooks/useError";
import EditErrorForm from "@/app/_components/EditErrorForm";
import { useUpdateError } from "@/app/_hooks/useUpdateError";
import { UpdateErrorRequestBody } from "@/app/_types/Errors/UpdateErrorRequestBody";
import { useRouter } from "next/navigation";
import { useDeleteError } from "@/app/_hooks/useDeleteError";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default function Page({ params }: PageProps) {
  const router = useRouter();
  const { id } = use(params);
  const { data, error, isLoading } = useError(id);
  const { updateError, isSubmitting } = useUpdateError();
  const { deleteError, isDeleting } = useDeleteError();
  const handleSubmit = async (values: UpdateErrorRequestBody) => {
    await updateError(id, values);

    router.push("/errors");
  };
  const handleDelete = async () => {
    const confirmed = window.confirm(
      "このエラー記録を削除してもよろしいですか？",
    );

    if (!confirmed) {
      return;
    }

    await deleteError(id);

    router.push("/errors");
  };

  if (isLoading) {
    return <div className="p-6">読み込み中...</div>;
  }

  if (error) {
    return (
      <div className="p-6 text-red-500">エラー情報の取得に失敗しました</div>
    );
  }

  if (!data) {
    return null;
  }

  const defaultValues = {
    title: data.error.title,
    resolutionTime: data.error.resolutionTime,
    errorMessage: data.error.errorMessage,
    situation: data.error.situation,
    cause: data.error.cause,
    solution: data.error.solution,
    learning: data.error.learning,

    technologies: data.error.technologies.map((technology) => ({
      id: technology.id,
      name: technology.name,
    })),

    attempts: data.error.attempts.map((attempt) => ({
      id: attempt.id,
      content: attempt.content,
    })),
  };

  return (
    <main className="mx-auto max-w-4xl px-6 py-8">
      <h1 className="mb-8 text-2xl font-bold text-gray-900">エラー編集</h1>

      <EditErrorForm
        defaultValues={defaultValues}
        onSubmit={handleSubmit}
        onDelete={handleDelete}
        isSubmitting={isSubmitting}
        isDeleting={isDeleting}
      />
    </main>
  );
}
