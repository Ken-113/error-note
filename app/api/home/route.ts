  import { prisma } from '@/app/_libs/prisma'
  import { getSupabaseUser } from '@/app/_libs/auth'
  import { NextRequest, NextResponse } from 'next/server'

  // Home APIのレスポンスの型
  export type HomeResponse = {
    recentErrors: {
      id: string
      title: string
      resolutionTime: number
      createdAt: Date
      technologies: {
        id: string
        name: string
      }[]
    }[]
    totalErrorCount: number
    technologyCounts: {
      id: string
      name: string
      count: number
    }[]
    averageResolutionTime: number
  }

  export const GET = async (request: NextRequest) => {
    // Authorizationヘッダーからtokenを取得
    const token = request.headers.get('Authorization') ?? ''

    // Supabase Authのユーザーを取得
    const user = await getSupabaseUser(token)

    // 認証されていない場合
    if (!user) {
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

      // Prisma Userが存在しない場合
      if (!dbUser) {
        return NextResponse.json(
          { message: 'ユーザーが見つかりません' },
          { status: 404 },
        )
      }

      // 最新のエラー3件を取得
      const recentErrors = await prisma.errorLog.findMany({
        where: {
          userId: dbUser.id,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 3,
        include: {
          technologies: {
            include: {
              technology: true,
            },
          },
        },
      })

      // 総登録件数を取得
      const totalErrorCount = await prisma.errorLog.count({
        where: {
          userId: dbUser.id,
        },
      })

      // 全体の平均解決時間を取得
      const averageResult = await prisma.errorLog.aggregate({
        where: {
          userId: dbUser.id,
        },
        _avg: {
          resolutionTime: true,
        },
      })
      // 平均解決時間がnullの場合は0にする
      const averageResolutionTime =
        averageResult._avg.resolutionTime ?? 0

      // ユーザーのエラーに紐づいている技術を取得
      const errorLogTechnologies =
        await prisma.errorLogTechnology.findMany({
          where: {
            errorLog: {
              userId: dbUser.id,
            },
          },
          include: {
            technology: true,
          },
        })

      // 技術ごとのエラー件数を集計
      const technologyCountMap = new Map<
        string,
        {
          id: string
          name: string
          count: number
        }
      >()

      for (const item of errorLogTechnologies) {
        const technology = item.technology
        const existing = technologyCountMap.get(technology.id)

        if (existing) {
          existing.count += 1
        } else {
          technologyCountMap.set(technology.id, {
            id: technology.id,
            name: technology.name,
            count: 1,
          })
        }
      }

      const technologyCounts = Array.from(
        technologyCountMap.values(),
      )

      // 最新エラーをフロントで扱いやすい形に整形
      const formattedRecentErrors = recentErrors.map((error) => ({
        id: error.id,
        title: error.title,
        resolutionTime: error.resolutionTime,
        createdAt: error.createdAt,
        technologies: error.technologies.map((item) => ({
          id: item.technology.id,
          name: item.technology.name,
        })),
      }))

      // Home用のデータをまとめて返す
      return NextResponse.json<HomeResponse>(
        {
          recentErrors: formattedRecentErrors,
          totalErrorCount,
          technologyCounts,
          averageResolutionTime,
        },
        { status: 200 },
      )
    } catch {
      return NextResponse.json(
        { message: 'Home情報の取得に失敗しました' },
        { status: 500 },
      )
    }
  }