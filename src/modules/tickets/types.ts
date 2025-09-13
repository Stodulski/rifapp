import { TicketStatus } from "@prisma/client"

TicketStatus
export type Ticket = {
  raffleId: string
  number: Number
  status?: TicketStatus

  buyerName?: String
  buyerPhone?: String
  buyerEmail?: String
  paidAt?: Date
  paymentRef?: Date
}

export type Tickets = Ticket[]