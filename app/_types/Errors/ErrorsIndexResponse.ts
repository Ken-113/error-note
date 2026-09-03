// エラー一覧APIのレスポンスの型
export type ErrorsIndexResponse = {
  errors: {
    id: string
    title: string
    resolutionTime: number
    createdAt: string
    updatedAt: string
    technologies: {
      id: string
      name: string
    }[]
  }[]
}