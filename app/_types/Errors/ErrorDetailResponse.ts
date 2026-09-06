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
    createdAt: string
    updatedAt: string
    attempts: {
      id: string
      attemptNumber: number
      content: string
      createdAt: string
      updatedAt: string
    }[]
    technologies: {
      id: string
      name: string
    }[]
  }
}