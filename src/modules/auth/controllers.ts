import type { UserLoginType, UserType } from '../user/types.js'

import {
  VerifyUserFormService,
  createUserService,
  verifyRefreshTokenService,
  revokeRefreshTokenService
} from './services.js'

import type { Request, Response, NextFunction } from 'express'

import sendSessionTokens from './helpers/sendSessionTokens.js'

export const registerController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userData: UserType = req.body
    const user = await createUserService(userData)
    const userId = user.id
    if (!userId) return res.status(500).json({ message: 'Server error.' })

    const { accessToken, csrfToken } = await sendSessionTokens(res, userId)

    res
      .status(200)
      .json({ message: 'Register successfully.', accessToken, csrfToken })
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
    const user = await VerifyUserFormService(userData)
    const userId = user.id
    if (!userId)
      return res.status(401).json({ message: 'User does not exists.' })

    const { accessToken, csrfToken } = await sendSessionTokens(res, userId)

    res
      .status(200)
      .json({ message: 'Logged in successfully.', accessToken, csrfToken })
  } catch (error) {
    next(error)
  }
}

export const checkRefreshController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies['refresh_token']
    if (!token) return res.status(401).json({ message: 'Unauthorized.' })
    const refreshTokenData = await verifyRefreshTokenService(token)
    const userId = refreshTokenData.userId
    const oldRefrehJti = refreshTokenData.jti
    const { accessToken, csrfToken } = await sendSessionTokens(
      res,
      userId
    )

    await revokeRefreshTokenService(token, oldRefrehJti)

    res
      .status(200)
      .json({ message: 'Logged in successfully.', accessToken, csrfToken })
  } catch (error) {
    next(error)
  }
}

export const logoutController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies['refresh_token']
    if (!token) return res.status(401).json({ message: 'Unauthorized.' })
    await revokeRefreshTokenService(token)
    res.status(200).json({
      message: 'Logout successfully.'
    })
  } catch (error) {
    next(error)
  }
}
