import { prisma } from '@/app/_libs/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseUser } from '@/app/_libs/auth'

// エラー一覧APIのレスポンスの型
export type ErrorsIndexResponse = {
  errors: {
    id: string
    title: string
    resolutionTime: number
    createdAt: Date
    updatedAt: Date
    technologies: {
      id: string
      name: string
    }[]
  }[]
}

export const GET = async (request: NextRequest) => {
  const token = request.headers.get('Authorization') ?? ''

  const user = await getSupabaseUser(token)

  if (!user) {
    return NextResponse.json(
      { message: '認証に失敗しました' },
      { status: 401 },
    )
  }

  try {
    
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

    // ④ エラー一覧を取得
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
        createdAt: 'desc',
      },
    })

    
    const formattedErrors = errors.map((error) => ({
      id: error.id,
      title: error.title,
      resolutionTime: error.resolutionTime,
      createdAt: error.createdAt,
      updatedAt: error.updatedAt,
      technologies: error.technologies.map((item) => ({
        id: item.technology.id,
        name: item.technology.name,
      })),
    }))

    return NextResponse.json<ErrorsIndexResponse>(
      { errors: formattedErrors },
      { status: 200 },
    )
  } catch {
    return NextResponse.json(
      { message: 'エラー一覧の取得に失敗しました' },
      { status: 500 },
    )
  }
}