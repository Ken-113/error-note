"use client";

import { UpdateErrorRequestBody } from "@/app/_types/Errors/UpdateErrorRequestBody";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { useState } from "react";

type EditErrorFormProps = {
  defaultValues: UpdateErrorRequestBody;
  onSubmit: (values: UpdateErrorRequestBody) => void;
  onDelete: () => void;
  isDeleting?: boolean;
};

export default function EditErrorForm({
  defaultValues,
  onSubmit,
  onDelete,
  isDeleting = false,
}: EditErrorFormProps) {
  const [technologyInput, setTechnologyInput] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors ,isSubmitting},
  } = useForm<UpdateErrorRequestBody>({
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "attempts",
  });

  const selectedTechnologies = useWatch({
    control,
    name: "technologies",
  });

  // 技術を追加
  const handleAddTechnology = () => {
    const name = technologyInput.trim();

    if (!name) {
      return;
    }

    const alreadyExists = selectedTechnologies.some(
      (technology) => technology.name === name,
    );

    if (alreadyExists) {
      return;
    }

    setValue("technologies", [
      ...selectedTechnologies,
      {
        name,
      },
    ]);

    setTechnologyInput("");
  };

  // 技術を削除
  const handleRemoveTechnology = (name: string) => {
    setValue(
      "technologies",
      selectedTechnologies.filter(
        (technology) => technology.name !== name,
      ),
    );
  };

  // 調査ステップを追加
  const handleAddAttempt = () => {
    append({
      content: "",
    });
  };

  // 調査ステップを削除
  const handleRemoveAttempt = (index: number) => {
    if (fields.length === 1) {
      return;
    }

    remove(index);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* 基本情報 */}
      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-6 text-lg font-bold text-gray-900">
          基本情報
        </h2>

        <div className="space-y-6">
          {/* タイトル */}
          <div>
            <label
              htmlFor="title"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              タイトル
            </label>

            <input
              id="title"
              type="text"
              placeholder="例：Next.jsでAPIリクエストが404になる"
              {...register("title", {
                required: "タイトルを入力してください",
              })}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />

            {errors.title && (
              <p className="mt-1 text-sm text-red-500">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* 使用技術 */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              使用技術
            </label>

            <div className="flex gap-2">
              <input
                type="text"
                value={technologyInput}
                onChange={(e) => setTechnologyInput(e.target.value)}
                placeholder="例：React"
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2"
              />

              <button
                type="button"
                onClick={handleAddTechnology}
                className="rounded-lg bg-gray-800 px-4 py-2 text-white hover:bg-gray-700"
              >
                追加
              </button>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {selectedTechnologies.map((technology) => (
                <span
                  key={technology.id ?? technology.name}
                  className="flex items-center gap-1 rounded-full bg-indigo-100 px-3 py-1 text-sm text-indigo-700"
                >
                  {technology.name}

                  <button
                    type="button"
                    onClick={() =>
                      handleRemoveTechnology(technology.name)
                    }
                    className="text-indigo-500 hover:text-indigo-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* 登録日 */}
          <div>
            <label
              htmlFor="createdAt"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              登録日
            </label>

            <input
              id="createdAt"
              type="text"
              value="登録済み"
              disabled
              className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-500"
            />
          </div>

          {/* 解決までの時間 */}
          <div>
            <label
              htmlFor="resolutionTime"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              解決までの時間（分）
            </label>

            <input
              id="resolutionTime"
              type="number"
              min="0"
              step="1"
              placeholder="例：120"
              {...register("resolutionTime", {
                required: "解決までの時間を入力してください",
                valueAsNumber: true,
                min: {
                  value: 0,
                  message: "0以上で入力してください",
                },
              })}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />

            {errors.resolutionTime && (
              <p className="mt-1 text-sm text-red-500">
                {errors.resolutionTime.message}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* エラー詳細 */}
      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-6 text-lg font-bold text-gray-900">
          エラー詳細
        </h2>

        <div className="space-y-6">
          {/* エラー内容 */}
          <div>
            <label
              htmlFor="errorMessage"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              エラー内容
            </label>

            <textarea
              id="errorMessage"
              rows={6}
              placeholder="発生したエラーメッセージを入力してください"
              {...register("errorMessage", {
                required: "エラー内容を入力してください",
              })}
              className="w-full resize-y rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />

            {errors.errorMessage && (
              <p className="mt-1 text-sm text-red-500">
                {errors.errorMessage.message}
              </p>
            )}
          </div>

          {/* 発生状況 */}
          <div>
            <label
              htmlFor="situation"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              発生状況
            </label>

            <textarea
              id="situation"
              rows={5}
              placeholder="どのような操作・状況でエラーが発生したか入力してください"
              {...register("situation", {
                required: "発生状況を入力してください",
              })}
              className="w-full resize-y rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />

            {errors.situation && (
              <p className="mt-1 text-sm text-red-500">
                {errors.situation.message}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* 調査ステップ */}
      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">
            調査ステップ
          </h2>

          <button
            type="button"
            onClick={handleAddAttempt}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            ＋ ステップを追加
          </button>
        </div>

        <div className="space-y-4">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="rounded-lg border border-gray-200 bg-gray-50 p-4"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="font-medium text-gray-700">
                  Step {index + 1}
                </span>

                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveAttempt(index)}
                    className="text-sm text-red-500 hover:text-red-700"
                  >
                    削除
                  </button>
                )}
              </div>

              <textarea
                rows={4}
                placeholder="このステップで調査した内容を入力してください"
                {...register(`attempts.${index}.content`, {
                  required: "調査内容を入力してください",
                })}
                className="w-full resize-y rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />

              {errors.attempts?.[index]?.content && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.attempts[index]?.content?.message}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 原因・解決方法・学んだこと */}
      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="space-y-6">
          {/* 原因 */}
          <div>
            <label
              htmlFor="cause"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              原因
            </label>

            <textarea
              id="cause"
              rows={5}
              placeholder="なぜこのエラーが発生したのか入力してください"
              {...register("cause", {
                required: "原因を入力してください",
              })}
              className="w-full resize-y rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />

            {errors.cause && (
              <p className="mt-1 text-sm text-red-500">
                {errors.cause.message}
              </p>
            )}
          </div>

          {/* 解決方法 */}
          <div>
            <label
              htmlFor="solution"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              解決方法
            </label>

            <textarea
              id="solution"
              rows={5}
              placeholder="どのように解決したのか入力してください"
              {...register("solution", {
                required: "解決方法を入力してください",
              })}
              className="w-full resize-y rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />

            {errors.solution && (
              <p className="mt-1 text-sm text-red-500">
                {errors.solution.message}
              </p>
            )}
          </div>

          {/* 学んだこと */}
          <div>
            <label
              htmlFor="learning"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              学んだこと
            </label>

            <textarea
              id="learning"
              rows={5}
              placeholder="今回のエラーから学んだことを入力してください"
              {...register("learning", {
                required: "学んだことを入力してください",
              })}
              className="w-full resize-y rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />

            {errors.learning && (
              <p className="mt-1 text-sm text-red-500">
                {errors.learning.message}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ボタン */}
      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="rounded-lg border border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 hover:bg-gray-50"
        >
          キャンセル
        </button>

        <button
          type="button"
          onClick={onDelete}
          disabled={isDeleting}
          className="rounded-lg bg-red-600 px-6 py-3 font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isDeleting ? "削除中..." : "削除する"}
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-indigo-600 px-6 py-3 font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "更新中..." : "更新する"}
        </button>
      </div>
    </form>
  );
}

