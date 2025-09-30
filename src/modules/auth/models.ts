import prisma from '../../db.js'
import { ApiError } from '../../helpers/apiError.js'
import type { NewRefreshToken } from './types.js'

export const createRefreshTokenModel = async (refrehToken: NewRefreshToken) => {
  try {
    const refreshToken = await prisma.refreshToken.create({
      data: {
        jti: refrehToken.jti,
        userId: refrehToken.userId,
        tokenHash: refrehToken.tokenHash,
        ip: refrehToken.ip ?? null,
        agent: refrehToken.agent ?? null
      }
    })
    return refreshToken
  } catch (error) {
    throw new ApiError(500, 'Server error.')
  }
}

export const findRefreshTokenModel = async (jti: string) => {
  try {
    const refreshToken = await prisma.refreshToken.findUnique({
      where: {
        jti
      },
      select: {
        jti: true,
        tokenHash: true,
        revokedAt: true,
        expiresAt: true,
        userId: true
      }
    })
    return refreshToken
  } catch (error) {
    throw new ApiError(500, 'Server error.')
  }
}

export const revokeRefreshTokenModel = async (
  jti: string,
  remplacedByToken?: string
) => {
  try {
    await prisma.refreshToken.update({
      where: {
        jti
      },
      data: {
        revokedAt: new Date(),
        remplacedByToken: remplacedByToken ?? null
      }
    })
  } catch (error: any) {
    throw new ApiError(500, 'Server error.')
  }
}
