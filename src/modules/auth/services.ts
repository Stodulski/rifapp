import { ApiError } from '../../helpers/apiError.js'
import type { UserType, UserLoginType } from '../user/types.js'
import cryptPassword from './helpers/cryptPassword.js'
import comparePassword from './helpers/comparePassword.js'
import { createUser, findUser } from '../user/models.js'

export const createUserService = async (userData: UserType) => {
  try {
    const passwordhash = await cryptPassword(userData.password)
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
    throw new ApiError(error.status, error.message)
  }
}

export const searchAndVerifyUserService = async (userData: UserLoginType) => {
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
    throw new ApiError(error.status, error.message)
  }
}
