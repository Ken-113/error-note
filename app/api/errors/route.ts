import { prisma } from "@/app/_libs/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseUser } from "@/app/_libs/auth";
import { ErrorsIndexResponse } from "@/app/_types/Errors/ErrorsIndexResponse";
import { CreateErrorRequestBody } from "@/app/_types/Errors/CreateErrorRequestBody";
import { CreateErrorResponse } from "@/app/_types/Errors/CreateErrorResponse";

export const GET = async (request: NextRequest) => {
  const token = request.headers.get("Authorization") ?? "";

  const user = await getSupabaseUser(token);

  if (!user) {
    return NextResponse.json(
      { message: "認証に失敗しました" },
      { status: 401 },
    );
  }

  try {
    const dbUser = await prisma.user.findUnique({
      where: {
        supabaseUserId: user.id,
      },
    });

    if (!dbUser) {
      return NextResponse.json(
        { message: "ユーザーが見つかりません" },
        { status: 404 },
      );
    }

    const errors = await prisma.errorLog.findMany({
      where: {
        userId: dbUser.id,
      },
      include: {
        technologies: {
          include: {
            technology: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const formattedErrors = errors.map((error) => ({
      id: error.id,
      title: error.title,
      resolutionTime: error.resolutionTime,
      createdAt: error.createdAt.toISOString(),
      updatedAt: error.updatedAt.toISOString(),
      technologies: error.technologies.map((item) => ({
        id: item.technology.id,
        name: item.technology.name,
      })),
    }));

    return NextResponse.json<ErrorsIndexResponse>(
      { errors: formattedErrors },
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      { message: "エラー一覧の取得に失敗しました" },
      { status: 500 },
    );
  }
};

export const POST = async (request: NextRequest) => {
  const token = request.headers.get("Authorization") ?? "";

  const user = await getSupabaseUser(token);

  if (!user) {
    return NextResponse.json(
      { message: "認証に失敗しました" },
      { status: 401 },
    );
  }

  try {
    const body: CreateErrorRequestBody = await request.json();

    const dbUser = await prisma.user.findUnique({
      where: {
        supabaseUserId: user.id,
      },
    });

    if (!dbUser) {
      return NextResponse.json(
        { message: "ユーザーが見つかりません" },
        { status: 404 },
      );
    }

    const technologyNames = [
      ...new Set(body.technologies.map((name) => name.trim()).filter(Boolean)),
    ];

    const errorLog = await prisma.errorLog.create({
      data: {
        userId: dbUser.id,
        title: body.title,
        resolutionTime: body.resolutionTime,
        errorMessage: body.errorMessage,
        situation: body.situation,
        cause: body.cause,
        solution: body.solution,
        learning: body.learning,

        technologies: {
          create: technologyNames.map((name) => ({
            technology: {
              connectOrCreate: {
                where: {
                  name,
                },
                create: {
                  name,
                },
              },
            },
          })),
        },

        attempts: {
          create: body.attempts.map((attempt) => ({
            attemptNumber: attempt.attemptNumber,
            content: attempt.content,
          })),
        },
      },
    });

    return NextResponse.json<CreateErrorResponse>(
      {
        id: errorLog.id,
      },
      {
        status: 201,
      },
    );
  } catch {
    return NextResponse.json(
      { message: "エラーの登録に失敗しました" },
      { status: 500 },
    );
  }
};
