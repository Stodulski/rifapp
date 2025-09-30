import jwt from 'jsonwebtoken'

export const generateAccessToken = (userId: string) => {
  const secret = process.env.ACCESS_SECRET as string
  return jwt.sign({ userId }, secret, {
    expiresIn: '24h'
  })
}

export const verifyAccessToken = (token: string) => {
  const secret = process.env.ACCESS_SECRET as string
  const decoded = jwt.verify(token, secret)
  return decoded
}

export const generateRefreshToken = (userId: string, jti: string) => {
  const secret = process.env.REFRESH_SECRET as string
  return jwt.sign({ userId, jti }, secret, {
    expiresIn: '7D'
  })
}

export const verifyRefreshToken = (token: string) => {
  const secret = process.env.REFRESH_SECRET as string
  const decoded = jwt.verify(token, secret)
  return decoded
}
