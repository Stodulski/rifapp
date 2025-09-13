import type { NextFunction, Request, Response } from 'express'
import type { Raffle } from './types.js'
import { generateRaffle, getRaffle } from './services.js'
import { ApiError } from '../../helpers/apiError.js'

export const createRaffleController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, price, quantity, prize } = req.body as Raffle
    const raffle = await generateRaffle({ name, price, quantity, prize })
    res
      .status(201)
      .json({ message: 'Raffle created successfully.', raffle: raffle.id })
  } catch (error) {
    next(error)
  }
}

export const getRaffleController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const raffleId = req.params.id
    if (!raffleId) throw new ApiError(404, 'Invalid raffle.')
    const raffle = await getRaffle(raffleId)
    res.status(200).json({ message: 'Raffle retrieved successfully.', raffle })
  } catch (error) {
    next(error)
  }
}
