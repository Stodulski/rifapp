import type { Response } from 'express'
import type { SessionTokens } from '../types.js'
import { createSessionTokens } from '../services.js'

const sendSessionTokens = async (res: Response, userId: string) => {
  const ip = res.req.ip || null
  const agent = res.req.get('User-Agent') || null

  const { accessToken, csrfToken, refreshToken }: SessionTokens =
    await createSessionTokens(userId, ip, agent)

  res.cookie('refresh_token', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'none',
    maxAge: 604800000 // 7 days
  })

  res.cookie('csrf_token', csrfToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'none',
    maxAge: 604800000 // 7 days
  })

  return { accessToken, csrfToken }
}

export default sendSessionTokens
