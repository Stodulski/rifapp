import prisma from '../../db.js'
import { ApiError } from '../../helpers/apiError.js'
import type { UserType } from './types.js'

export const createUser = async (userData: UserType) => {
  try {
    const user = await prisma.user.create({
      data: userData,
      select: {
        id: true
      }
    })
    return user
  } catch (error: any) {
    if (error.code === 'P2002') {
      throw new ApiError(400, 'Email in use.')
    }
    throw new ApiError(error.status || 500, error.message || 'Server error.')
  }
}

export const findUser = async (userEmail: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: userEmail
      },
      select: {
        id: true,
        password: true
      }
    })
    if(!user){
        throw new ApiError(400, "Email doest not exist.")
    }
    return user
  } catch (error: any) {
    throw new ApiError(error.status || 500, error.message || 'Server error.')
  }
}
