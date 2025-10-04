import type { Raffle } from "./types.js";

import { ApiError } from "../../helpers/apiError.js";
import {
  createRaffle,
  searchRaffle,
  searchRaffleWithPaidOrReservedTickets,
  searchRaffleWithPaidTickets,
  searchRaffleWithTickets,
  changeRaffleStatus,
  finishRaffleStatus,
} from "./models.js";
import generateTicketNumbers from "./helpers/generateTicketNumbers.js";
import { createTickets, searchTicket } from "../tickets/models.js";
import { sendEmail } from "../../helpers/sendEmail.js";
import { RaffleStatus } from "@prisma/client";

export const generateRaffle = async ({
  name,
  price,
  quantity,
  prize,
  userId,
}: Raffle) => {
  try {
    const raffle = await createRaffle({ name, price, quantity, prize, userId });
    const tickets = generateTicketNumbers(quantity, raffle.id);
    await createTickets(tickets);
    return raffle;
  } catch (error: any) {
    throw new ApiError(error.status || 500, error.message || "Server error.");
  }
};

export const getRaffle = async (raffleId: string) => {
  try {
    const raffle = await searchRaffleWithTickets(raffleId);
    return raffle;
  } catch (error: any) {
    throw new ApiError(error.status || 500, error.message || "Server error.");
  }
};

export const cancelRaffle = async (raffleId: string) => {
  try {
    const raffleTickets = await searchRaffleWithPaidOrReservedTickets(raffleId);
    if (raffleTickets?.Tickets) {
      throw new ApiError(
        409,
        "Cannot delete raffles with paid or reserved tickets"
      );
    }
    const canceledRaffle = await changeRaffleStatus(
      raffleId,
      RaffleStatus.CANCELED
    );
    if (!canceledRaffle) {
      throw new ApiError(500, "Server error.");
    }

    return canceledRaffle;
  } catch (error: any) {
    throw new ApiError(error.status || 500, error.message || "Server error.");
  }
};

export const drawRaffle = async (raffleId: string) => {
  try {
    const raffleTickets = await searchRaffleWithPaidTickets(raffleId);

    if (!raffleTickets?.Tickets) {
      throw new ApiError(409, "Cannot draw with not paid tickets.");
    }

    const randomNumber = Math.floor(
      Math.random() * raffleTickets?.Tickets.length
    );

    const raffle = await searchRaffle(raffleId);

    if (!raffle) {
      throw new ApiError(400, "Raffle not found.");
    }

    const ticketWinnerId = raffleTickets?.Tickets[randomNumber]?.id;

    if (!ticketWinnerId) {
      throw new ApiError(400, "Invalid Ticket.");
    }

    const ticketWinnerData = await searchTicket(ticketWinnerId);

    if (!ticketWinnerData?.transactionId) {
      throw new ApiError(409, "Ticket not paid.");
    }

    const raffleName = raffle.name;
    const rafflePrize = raffle.prize;
    const winnerName = ticketWinnerData.buyerName;
    const winnerEmail = ticketWinnerData.buyerEmail;

    if (winnerEmail) {
      await sendEmail(
        winnerEmail,
        `Congratulations ${winnerName}, you win the raffle ${raffleName}, your prize is ${rafflePrize}`,
        `Rifapp - ${winnerName}, you win a raffle!`
      );
    }

    await finishRaffleStatus(raffle.id, winnerEmail, ticketWinnerId);

    return {
      raffle,
      ticketWinnerData,
    };
  } catch (error: any) {
    throw new ApiError(error.status || 500, error.message || "Server error.");
  }
};
