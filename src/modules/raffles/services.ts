import type { Raffle } from './types.js'

import { ApiError } from '../../helpers/apiError.js'
import { createRaffle, searchRaffle } from './models.js'
import generateTicketNumbers from './helpers/generateTicketNumbers.js'
import { createTickets } from '../tickets/models.js'

export const generateRaffle = async ({
  name,
  price,
  quantity,
  prize,
  ownerId = null
}: Raffle) => {
  try {
    const raffle = await createRaffle({ name, price, quantity, prize, ownerId })
    const tickets = generateTicketNumbers(quantity, raffle.id)
    await createTickets(tickets)
    return raffle
  } catch (error: any) {
    throw new ApiError(error.status || 500, error.message || 'Server error.')
  }
}

export const getRaffle = async (raffleId: string) => {
  try {
    const raffle = await searchRaffle(raffleId)
    return raffle
  } catch (error: any) {
    throw new ApiError(error.status || 500, error.message || 'Server error.')
  }
}
