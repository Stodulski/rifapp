import jwt from 'jsonwebtoken'

export const generateAccessToken = (userId: string) => {
  const secret = process.env.ACCESS_SECRET as string
  return jwt.sign({ userId }, secret, {
    expiresIn: '24h'
  })
}

export const verifyAccesToken = (token: string)=>{
    const secret = process.env.ACCESS_SECRET as string
    const decoded = jwt.verify(token, secret)
    return decoded
}
