import { TicketStatus } from "@prisma/client"

export type Ticket = {
  raffleId: string
  number: number
  status?: TicketStatus
  buyerName?: string
  buyerPhone?: string
  buyerEmail?: string
  paidAt?: Date | string      
  paymentRef?: Date | string 
}

export type Tickets = Ticket[]
