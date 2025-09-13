import type { NextFunction, Request, Response } from 'express'

export class ApiError extends Error {
  public status: number
  constructor (status: number, message: string) {
    super(message)
    this.status = status ?? 500
  }
}

export const errorHandle = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const status = err.status ? err.status : 500
  const message = err.message ? err.message : 'Server error.'

  res.status(status).json({ message })
}
