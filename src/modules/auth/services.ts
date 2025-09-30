import { ApiError } from '../../helpers/apiError.js'
import type { UserType, UserLoginType } from '../user/types.js'
import encryptPassword from './helpers/encryptPassword.js'
import comparePassword from './helpers/comparePassword.js'
import { createUser, findUser } from '../user/models.js'
import crypto from 'crypto'
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken
} from './helpers/jwt.js'
import encryptRefreshToken from './helpers/encryptRefreshToken.js'
import {
  createRefreshTokenModel,
  findRefreshTokenModel,
  revokeRefreshTokenModel
} from './models.js'
import type { RefreshTokenPayload } from './types.js'
import compareRefreshToken from './helpers/compareRefreshToken.js'

export const createUserService = async (userData: UserType) => {
  try {
    const passwordhash = await encryptPassword(userData.password)
    const birthdate = new Date(userData.birthdate)
    const userToCreate = {
      name: userData.name,
      lastname: userData.lastname,
      birthdate,
      phone: userData.phone,
      email: userData.email,
      password: passwordhash
    }
    const user = await createUser(userToCreate)
    return user
  } catch (error: any) {
    throw new ApiError(error.status || 500, error.message || 'Server error.')
  }
}

export const VerifyUserFormService = async (userData: UserLoginType) => {
  try {
    const user = await findUser(userData.email)
    const correctPassword = await comparePassword(
      userData.password,
      user?.password
    )
    if (!correctPassword) {
      throw new ApiError(401, 'Incorrect password.')
    }
    return {
      id: user.id
    }
  } catch (error: any) {
    throw new ApiError(error.status || 500, error.message || 'Server error.')
  }
}

export const createSessionTokens = async (
  userId: string,
  ip: string | null,
  agent: string | null
) => {
  try {
    const jti = crypto.randomUUID()
    const accessToken = generateAccessToken(userId)

    const refreshToken = generateRefreshToken(userId, jti)
    const refreshTokenHash = encryptRefreshToken(refreshToken)

    await createRefreshTokenModel({
      jti,
      userId,
      tokenHash: refreshTokenHash,
      ip,
      agent
    })

    const csrfToken = crypto.randomUUID()

    return {
      accessToken,
      csrfToken,
      refreshToken
    }
  } catch (error: any) {
    console.log(error)
    throw new ApiError(error.status || 500, error.message || 'Server error.')
  }
}

export const revokeRefreshTokenService = async (
  token: string,
  oldRefreshTokenJti?: string
) => {
  const refreshTokenPayload = verifyRefreshToken(token) as RefreshTokenPayload
  await revokeRefreshTokenModel(refreshTokenPayload.jti, oldRefreshTokenJti)
}

export const verifyRefreshTokenService = async (token: string) => {
  try {
    const refreshTokenPayload = verifyRefreshToken(token) as RefreshTokenPayload
    const refreshToken = await findRefreshTokenModel(refreshTokenPayload.jti)
    const now = new Date()
    if (
      !refreshToken ||
      refreshToken.expiresAt < now ||
      refreshToken.revokedAt
    ) {
      throw new ApiError(401, 'Unauthorized.')
    }

    const checkToken = compareRefreshToken(token, refreshToken.tokenHash)

    if (!checkToken) {
      throw new ApiError(401, 'Unauthorized.')
    }

    return refreshToken
  } catch (error: any) {
    throw new ApiError(error.status || 500, error.message || 'Server error.')
  }
}
