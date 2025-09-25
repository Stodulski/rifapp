import type { NextFunction, Response, Request } from 'express'
import { verifyAccesToken } from '../helpers/jwt.js'
import type { AccessTokenPayload } from '../types.js'

const checkAuth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.access_token
  if (!token) {
    return res.status(401).json({ message: 'Access token missing' })
  }
  try {
    const decoded = verifyAccesToken(token) as AccessTokenPayload
    req.user.id = decoded.userId
    next()
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token' })
  }
}

export default checkAuth
