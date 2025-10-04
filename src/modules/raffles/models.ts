import prisma from "../../db.js";
import type { Raffle } from "./types.js";
import { ApiError } from "../../helpers/apiError.js";
import { RaffleStatus, TicketStatus } from "@prisma/client";

export const createRaffle = async ({
  name,
  price,
  quantity,
  prize,
  userId,
}: Raffle) => {
  try {
    const raffle = await prisma.raffle.create({
      data: { name, price, quantity, prize, userId },
      select: { id: true },
    });
    return raffle;
  } catch (error: any) {
    throw new ApiError(error.status || 500, error.message || "Server error.");
  }
};

export const searchRaffleWithTickets = async (raffleId: string) => {
  try {
    const raffle = await prisma.raffle.findUnique({
      where: { id: raffleId },
      select: {
        name: true,
        price: true,
        userId: true,
        prize: true,
        quantity: true,
        Tickets: {
          select: {
            id: true,
            number: true,
            status: true,
          },
          orderBy: {
            number: "asc",
          },
        },
      },
    });
    return raffle;
  } catch (error: any) {
    throw new ApiError(error.status || 500, error.message || "Server error.");
  }
};

export const searchRaffle = async (raffleId: string) => {
  try {
    const raffle = await prisma.raffle.findUnique({
      where: {
        id: raffleId,
      },
    });
    return raffle;
  } catch (error: any) {
    throw new ApiError(error.status || 500, error.message || "Server error.");
  }
};

export const searchRaffleWithPaidOrReservedTickets = async (
  raffleId: string
) => {
  try {
    const raffle = await prisma.raffle.findUnique({
      where: {
        id: raffleId,
      },
      select: {
        Tickets: {
          where: {
            status: TicketStatus.PAID || TicketStatus.RESERVED,
          },
          select: {
            status: true,
          },
        },
      },
    });
    return raffle;
  } catch (error: any) {
    throw new ApiError(error.status || 500, error.message || "Server error.");
  }
};

export const searchRaffleWithPaidTickets = async (raffleId: string) => {
  try {
    const raffle = await prisma.raffle.findUnique({
      where: {
        id: raffleId,
      },
      select: {
        Tickets: {
          where: {
            status: TicketStatus.PAID,
          },
          select: {
            id: true,
            status: true,
          },
        },
      },
    });
    return raffle;
  } catch (error: any) {
    throw new ApiError(error.status || 500, error.message || "Server error.");
  }
};

export const changeRaffleStatus = async (
  raffleId: string,
  status: RaffleStatus
) => {
  try {
    const raffle = await prisma.raffle.update({
      where: { id: raffleId },
      data: {
        status,
      },
    });
    return raffle;
  } catch (error: any) {
    throw new ApiError(error.status || 500, error.message || "Server error.");
  }
};

export const finishRaffleStatus = async (
  raffleId: string,
  winnerEmail: string | null,
  ticketWinnerId: string
) => {
  try {
    const raffle = await prisma.raffle.update({
      where: { id: raffleId },
      data: {
        status: RaffleStatus.FINISHED,
        winnerEmail,
        ticketWinnerId,
      },
    });
    return raffle;
  } catch (error: any) {
    throw new ApiError(error.status || 500, error.message || "Server error.");
  }
};
