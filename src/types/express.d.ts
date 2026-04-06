import "express"

declare global {
  namespace Express {
    interface Request {
      user?: {
        _id?: string
        role?: string
        [key: string]: unknown
      }
    }
  }
}

export {}
