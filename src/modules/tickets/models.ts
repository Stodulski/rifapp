import prisma from '../../db.js'

import { ApiError } from '../../helpers/apiError.js'
import type { Tickets } from './types.js'

export const createTickets = async (tickets: Tickets) => {
  try {
    const ticketsResult = await prisma.ticket.createMany({ data: tickets })
    return ticketsResult
  } catch (error: any) {
    throw new ApiError(error.status || 500, error.message || 'Server error.')
  }
}
