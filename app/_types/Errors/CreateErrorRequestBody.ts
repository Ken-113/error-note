export type CreateErrorRequestBody = {
  title: string
  resolutionTime: number
  errorMessage: string
  situation: string
  cause: string
  solution: string
  learning: string
  technologies: string[]
  attempts: {
    attemptNumber: number
    content: string
  }[]
}