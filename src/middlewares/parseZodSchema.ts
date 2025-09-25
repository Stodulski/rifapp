import type { Request, Response, NextFunction } from 'express'
import type { ZodType } from 'zod'

export const parseZodSchema = (schema: ZodType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body)

    if (!result.success) {
      const errors = result.error.issues.map(
        (err: { path: any[]; message: any }) => ({
          field: err.path.join('.'),
          message: err.message
        })
      )

      return res.status(400).json({ message: 'Validation error.', errors })
    }

    req.body = result.data
    next()
  }
}

export default parseZodSchema
