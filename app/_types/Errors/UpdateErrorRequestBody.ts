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