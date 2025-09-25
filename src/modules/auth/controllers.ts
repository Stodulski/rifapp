import type { UserLoginType, UserType } from '../user/types.js'
import { generateAccessToken } from './helpers/jwt.js'
import { searchAndVerifyUserService, createUserService } from './services.js'
import type { Request, Response, NextFunction } from 'express'

const SendTokens = (req: Request, res: Response, userId: string) => {
  const accessToken = generateAccessToken(userId)
  res.cookie('access_token', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'none',
    maxAge: 86400000 // 24 hours
  })
  return accessToken
}

export const registerController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userData: UserType = req.body
    const user = await createUserService(userData)
    if (!user) res.status(500).json({ message: 'Server error.' })
    const accessToken = SendTokens(req, res, user.id)
    res.status(200).json({ message: 'Register successfully.', accessToken })
  } catch (error) {
    next(error)
  }
}

export const loginController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userData: UserLoginType = req.body
    const user = await searchAndVerifyUserService(userData)
    const userId = user.id
    if (userId === undefined) {
      return res.status(401).json({ message: 'User does not exists.' })
    }
    const accessToken = SendTokens(req, res, userId)
    res.status(200).json({ message: 'Logged in successfully.', accessToken })
  } catch (error) {
    next(error)
  }
}
