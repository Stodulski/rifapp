import type { NextFunction, Response, Request } from 'express'
import { verifyAccessToken } from '../helpers/jwt.js'
import type { AccessTokenPayload } from '../types.js'

const verifyCsrf = (req: Request, res: Response, next: NextFunction) => {
  
  const cookieCsrf = req.cookies['csrf_token'] || ''
  const headerCsrf = req.get('X-CSRF-token') || ''
  if (!headerCsrf || !cookieCsrf || cookieCsrf !== headerCsrf) {
    res.status(401).json({ message: 'CSRF error' })
  }
  next()
}

const refreshRequired = (req: Request, res: Response, next: NextFunction)=>{
  const refreshtoken = req.cookies['refresh_token']
  if (!refreshtoken) {
    return res.status(401).json({ message: 'Unauthorized.' })
  }
  next()
}

const verifySession = (req: Request, res: Response, next: NextFunction) => {
  const bearerToken = req.get('Authorization')?.trim().split(' ')
  if (!bearerToken || bearerToken[0]?.toLowerCase() !== 'bearer') {
    return res.status(401).json({ message: 'Unauthorized.' })
  }
  const token = bearerToken[1]
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' })
  }
  try {
    const decoded = verifyAccessToken(token) as AccessTokenPayload
    req.user.id = decoded.userId
    next()
  } catch (error) {
    return res.status(403).json({ message: 'Unauthorized' })
  }
}

export { verifySession, verifyCsrf, refreshRequired }
