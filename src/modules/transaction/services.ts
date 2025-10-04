import { ApiError } from "../../helpers/apiError.js";
import prisma from "../../db.js";
import { searchTransactionByIdempotencyKey } from "./models.js";
import type { TicketBuy, Tickets } from "../tickets/types.js";
import { searchTicketsById } from "../tickets/models.js";
import { searchRaffle } from "../raffles/models.js";
import { TicketStatus, TransactionStatus } from "@prisma/client";

export const purchaseTickets = async (
  idempotencyKey: string,
  tickets: TicketBuy[]
) => {
  try {
    const existTransaction = await searchTransactionByIdempotencyKey(
      idempotencyKey
    );
    if (existTransaction) {
      return existTransaction;
    }

    const ticketsId = tickets.map((ticket) => ticket.id);

    const availableTickets = await searchTicketsById(ticketsId);

    if (availableTickets.length !== ticketsId.length) {
      throw new ApiError(409, "One or more tickets are not available.");
    }

    const raffleId = availableTickets[0]?.raffleId;

    const allSameRaffle = availableTickets.every(
      (t: any) => t.raffleId === raffleId
    );

    if (!allSameRaffle || !raffleId) {
      throw new ApiError(409, "All tickets must belong to the same raffle.");
    }

    const raffle = await searchRaffle(raffleId);

    if (!raffle) {
      throw new ApiError(409, "The raffle does not exist");
    }

    const totalAmount = raffle?.price * BigInt(ticketsId.length);

    await prisma.$transaction(async (tx) => {
        // Reserve Tickets
      await tx.ticket.updateMany({
        where: {
          id: {
            in: ticketsId,
          },
        },
        data: {
          status: TicketStatus.RESERVED,
        },
      });

      const newTransaction = await tx.transaction.create({
        data: {
          idempotencyKey,
          amount: totalAmount,
          status: TransactionStatus.PENDING,
        },
      });

      const raffleOwner = await tx.user.findUnique({
        where:{
            id: raffle.userId
        }
      })



    });
  } catch (error: any) {
    throw new ApiError(error.status || 500, error.message || "Server error.");
  }
};
