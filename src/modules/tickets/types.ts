import { TicketStatus } from "@prisma/client";

export type Ticket = {
  raffleId: string;
  number: number;
};

export type TicketBuy = {
  id: string;
  number: number;
  buyerName?: string;
  buyerPhone?: string;
  buyerEmail?: string;
};

export type Tickets = Ticket[];
