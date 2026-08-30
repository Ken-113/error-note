import { prisma } from "@/app/_libs/prisma";
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/app/_libs/supabase";

// 技術一覧APIのレスポンスの型
export type TechnologiesIndexResponse = {
  technologies: {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
  }[];
};

// 技術作成時に送られてくるリクエストbodyの型
export type CreateTechnologyRequestBody = {
  name: string;
};

// 技術作成APIのレスポンスの型
export type CreateTechnologyResponse = {
  id: string;
};

// 技術一覧取得API
export const GET = async (request: NextRequest) => {
  const token = request.headers.get("Authorization") ?? "";

  const { error } = await supabase.auth.getUser(token);

  if (error) {
    return NextResponse.json(
      { message: "認証に失敗しました" },
      { status: 401 },
    );
  }

  try {
    const technologies = await prisma.technology.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json<TechnologiesIndexResponse>(
      { technologies },
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      { message: "技術の取得に失敗しました" },
      { status: 500 },
    );
  }
};

// 技術作成API
export const POST = async (request: NextRequest) => {
  const token = request.headers.get("Authorization") ?? "";

  const { error } = await supabase.auth.getUser(token);

  if (error) {
    return NextResponse.json(
      { message: "認証に失敗しました" },
      { status: 401 },
    );
  }

  try {
    const body = await request.json();

    const { name }: CreateTechnologyRequestBody = body;

    const data = await prisma.technology.create({
      data: {
        name,
      },
    });

    return NextResponse.json<CreateTechnologyResponse>(
      { id: data.id },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      { message: "技術の作成に失敗しました" },
      { status: 500 },
    );
  }
};
