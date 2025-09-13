import prisma from '../../db.js'
import type { Raffle } from './types.js'
import { ApiError } from '../../helpers/apiError.js'

export const createRaffle = async ({
  name,
  price,
  quantity,
  prize,
  ownerId = null
}: Raffle) => {
  try {
    const raffle = await prisma.raffle.create({
      data: { name, price, quantity, prize, ownerId },
      select: { id: true }
    })
    return raffle
  } catch (error: any) {
    throw new ApiError(error.status || 500, error.message || 'Server error.')
  }
}

export const searchRaffle = async (raffleId: string) => {
  try {
    const raffle = await prisma.raffle.findUnique({
      where: { id: raffleId },
      select: {
        name: true,
        price: true,
        ownerId: true,
        prize: true,
        quantity: true,
        Ticket: {
          select: {
            id: true,
            number: true,
            status: true
          },
          orderBy: {
            number: 'asc'
          }
        }
      }
    })
    return raffle
  } catch (error: any) {
    throw new ApiError(error.status || 500, error.message || 'Server error.')
  }
}
