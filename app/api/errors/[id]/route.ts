import { prisma } from '@/app/_libs/prisma'
import { supabase } from '@/app/_libs/supabase'
import { NextRequest, NextResponse } from 'next/server'

export type ErrorDetailResponse = {
  error: {
    id: string
    title: string
    resolutionTime: number
    errorMessage: string
    situation: string
    cause: string
    solution: string
    learning: string
    createdAt: Date
    attempts: {
      id: string
      attemptNumber: number
      content: string
      createdAt: Date
    }[]
    technologies: {
      id: string
      name: string
    }[]
  }
}

export const GET = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  const token = request.headers.get('Authorization') ?? ''

  // Supabase Authのユーザーを取得
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token)

  if (error || !user) {
    return NextResponse.json(
      { message: '認証に失敗しました' },
      { status: 401 },
    )
  }

  try {
    // Supabase UserとPrisma Userを紐付ける
    const dbUser = await prisma.user.findUnique({
      where: {
        supabaseUserId: user.id,
      },
    })

    if (!dbUser) {
      return NextResponse.json(
        { message: 'ユーザーが見つかりません' },
        { status: 404 },
      )
    }

    const { id } = await params

    
    const errorLog = await prisma.errorLog.findFirst({
      where: {
        id,
        userId: dbUser.id,
      },
      include: {
        attempts: {
          orderBy: {
            attemptNumber: 'asc',
          },
        },
        technologies: {
          include: {
            technology: true,
          },
        },
      },
    })

    if (!errorLog) {
      return NextResponse.json(
        { message: 'エラーログが見つかりません' },
        { status: 404 },
      )
    }

    // フロントで扱いやすい形に整形
    const formattedError = {
      id: errorLog.id,
      title: errorLog.title,
      resolutionTime: errorLog.resolutionTime,
      errorMessage: errorLog.errorMessage,
      situation: errorLog.situation,
      cause: errorLog.cause,
      solution: errorLog.solution,
      learning: errorLog.learning,
      createdAt: errorLog.createdAt,

      attempts: errorLog.attempts.map((attempt) => ({
        id: attempt.id,
        attemptNumber: attempt.attemptNumber,
        content: attempt.content,
        createdAt: attempt.createdAt,
      })),

      technologies: errorLog.technologies.map((item) => ({
        id: item.technology.id,
        name: item.technology.name,
      })),
    }

    return NextResponse.json<ErrorDetailResponse>(
      { error: formattedError },
      { status: 200 },
    )
  } catch {
    return NextResponse.json(
      { message: 'エラーログの取得に失敗しました' },
      { status: 500 },
    )
  }
}



// エラー更新時のリクエストbody
export type UpdateErrorRequestBody = {
  title: string
  resolutionTime: number
  errorMessage: string
  situation: string
  cause: string
  solution: string
  learning: string

  // 使用技術
  technologies: {
    id?: string
    name: string
  }[]

  // 解決までの試行
  attempts: {
    id?: string
    content: string
  }[]
}

// エラー更新APIのレスポンス
export type UpdateErrorResponse = {
  id: string
}

export const PUT = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  const token = request.headers.get('Authorization') ?? ''

  // Supabase Authのユーザーを取得
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token)

  // 認証チェック
  if (error || !user) {
    return NextResponse.json(
      { message: '認証に失敗しました' },
      { status: 401 },
    )
  }

  try {
    // Prisma側のUserを取得
    const dbUser = await prisma.user.findUnique({
      where: {
        supabaseUserId: user.id,
      },
    })

    if (!dbUser) {
      return NextResponse.json(
        { message: 'ユーザーが見つかりません' },
        { status: 404 },
      )
    }

    const { id } = await params

    // リクエストbodyを取得
    const body: UpdateErrorRequestBody = await request.json()

    // エラーの所有者を確認
    const existingError = await prisma.errorLog.findFirst({
      where: {
        id,
        userId: dbUser.id,
      },
    })

    if (!existingError) {
      return NextResponse.json(
        { message: 'エラーログが見つかりません' },
        { status: 404 },
      )
    }

    // Transaction開始
    await prisma.$transaction(async (tx) => {
      // ① ErrorLog本体を更新
      await tx.errorLog.update({
        where: {
          id,
        },
        data: {
          title: body.title,
          resolutionTime: body.resolutionTime,
          errorMessage: body.errorMessage,
          situation: body.situation,
          cause: body.cause,
          solution: body.solution,
          learning: body.learning,
        },
      })

      // ② 現在のTechnologyとの紐付きを一度削除
      await tx.errorLogTechnology.deleteMany({
        where: {
          errorLogId: id,
        },
      })

      // ③ Technologyを処理
      for (const technology of body.technologies) {
        let technologyId = technology.id

        // 新しいTechnologyの場合
        if (!technologyId) {
          const existingTechnology =
            await tx.technology.findUnique({
              where: {
                name: technology.name,
              },
            })

          if (existingTechnology) {
            technologyId = existingTechnology.id
          } else {
            const newTechnology = await tx.technology.create({
              data: {
                name: technology.name,
              },
            })

            technologyId = newTechnology.id
          }
        }

        // ErrorLogとTechnologyを紐付ける
        await tx.errorLogTechnology.create({
          data: {
            errorLogId: id,
            technologyId,
          },
        })
      }

      // ④ 現在のAttemptsを一度削除
      await tx.errorAttempt.deleteMany({
        where: {
          errorLogId: id,
        },
      })

      // ⑤ Attemptsを再登録
      for (const [index, attempt] of body.attempts.entries()) {
        await tx.errorAttempt.create({
          data: {
            errorLogId: id,
            attemptNumber: index + 1,
            content: attempt.content,
          },
        })
      }
    })

    return NextResponse.json<UpdateErrorResponse>(
      { id },
      { status: 200 },
    )
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      { message: 'エラーログの更新に失敗しました' },
      { status: 500 },
    )
  }
}

export const DELETE = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  const token = request.headers.get('Authorization') ?? ''

  // Supabase Authのユーザーを取得
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token)

  // 認証チェック
  if (error || !user) {
    return NextResponse.json(
      { message: '認証に失敗しました' },
      { status: 401 },
    )
  }

  try {
    // Prisma側のUserを取得
    const dbUser = await prisma.user.findUnique({
      where: {
        supabaseUserId: user.id,
      },
    })

    if (!dbUser) {
      return NextResponse.json(
        { message: 'ユーザーが見つかりません' },
        { status: 404 },
      )
    }

    const { id } = await params

    // エラーを削除
    const errorLog = await prisma.errorLog.deleteMany({
      where: {
        id,
        userId: dbUser.id,
      },
    })

    // 削除対象が存在しない場合
    if (errorLog.count === 0) {
      return NextResponse.json(
        { message: 'エラーログが見つかりません' },
        { status: 404 },
      )
    }

    return NextResponse.json(
      { message: 'エラーログを削除しました' },
      { status: 200 },
    )
  } catch {
    return NextResponse.json(
      { message: 'エラーログの削除に失敗しました' },
      { status: 500 },
    )
  }
}