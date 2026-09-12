import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import ErrorForm from "@/app/_components/ErrorForm";

describe("ErrorForm", () => {
  it("フォームが表示される", () => {
    render(<ErrorForm onSubmit={vi.fn()} />);

    expect(
      screen.getByRole("heading", { name: "基本情報" }),
    ).toBeInTheDocument();

    expect(screen.getByLabelText("タイトル")).toBeInTheDocument();
    expect(screen.getByLabelText("解決までの時間（分）")).toBeInTheDocument();
    expect(screen.getByLabelText("エラー内容")).toBeInTheDocument();
    expect(screen.getByLabelText("発生状況")).toBeInTheDocument();
    expect(screen.getByLabelText("原因")).toBeInTheDocument();
    expect(screen.getByLabelText("解決方法")).toBeInTheDocument();
    expect(screen.getByLabelText("学んだこと")).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "登録する" }),
    ).toBeInTheDocument();
  });
});
it("タイトルが未入力の場合、エラーメッセージが表示される", async () => {
  const user = userEvent.setup();
  const onSubmit = vi.fn();

  render(<ErrorForm onSubmit={onSubmit} />);

  await user.click(screen.getByRole("button", { name: "登録する" }));

  expect(screen.getByText("タイトルを入力してください")).toBeInTheDocument();

  expect(onSubmit).not.toHaveBeenCalled();
});
it("正しい内容を入力すると送信できる", async () => {
  const user = userEvent.setup();
  const onSubmit = vi.fn();

  render(<ErrorForm onSubmit={onSubmit} />);

  await user.type(screen.getByLabelText("タイトル"), "Prisma Clientの型エラー");

  await user.clear(screen.getByLabelText("解決までの時間（分）"));

  await user.type(screen.getByLabelText("解決までの時間（分）"), "30");

  await user.type(
    screen.getByLabelText("エラー内容"),
    "Prisma Clientの型が見つからない",
  );

  await user.type(
    screen.getByLabelText("発生状況"),
    "Prisma Clientをimportした際にエラーが発生した",
  );

  await user.type(
    screen.getByPlaceholderText("このステップで調査した内容を入力してください"),
    "Prisma Clientの生成状態を確認した",
  );

  await user.type(
    screen.getByLabelText("原因"),
    "Prisma Clientが生成されていなかった",
  );

  await user.type(
    screen.getByLabelText("解決方法"),
    "npx prisma generateを実行した",
  );

  await user.type(
    screen.getByLabelText("学んだこと"),
    "schema変更後はClientの再生成が必要",
  );

  await user.click(screen.getByRole("button", { name: "登録する" }));

  expect(onSubmit).toHaveBeenCalledTimes(1);

  expect(onSubmit).toHaveBeenCalledWith(
    expect.objectContaining({
      title: "Prisma Clientの型エラー",
      resolutionTime: 30,
      errorMessage: "Prisma Clientの型が見つからない",
      situation: "Prisma Clientをimportした際にエラーが発生した",
      cause: "Prisma Clientが生成されていなかった",
      solution: "npx prisma generateを実行した",
      learning: "schema変更後はClientの再生成が必要",
    }),
    expect.anything(),
  );
});
