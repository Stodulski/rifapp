import crypto from "crypto"

const encryptRefreshToken = (token: string)=>{
    const secret = process.env.REFRESH_HASH_SECRET as string
    const tokenHash = crypto.createHmac("sha256", secret).update(token).digest('hex')
    return tokenHash
}

export default encryptRefreshToken