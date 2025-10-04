import prisma from "../../db.js";
import { ApiError } from "../../helpers/apiError.js";

export const searchTransactionByIdempotencyKey = async (idempotencyKey: string)=>{

try {
    const transaction = await prisma.transaction.findUnique({where:{
        idempotencyKey
    }, select:{
        id: true
    }})
    return transaction
} catch (error: any) {
    throw new ApiError(error.status || 500, error.message || "Server error.")
}
}