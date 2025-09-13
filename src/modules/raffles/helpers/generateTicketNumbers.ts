import type { Tickets } from "../../tickets/types.js"

const generateTicketNumbers = (quantity: number, raffleId: string) => {
    const tickets: Tickets = []
    for(let i = 0; i < quantity; i++){
        tickets.push({number: i, raffleId})
    }
    return tickets
}


export default generateTicketNumbers