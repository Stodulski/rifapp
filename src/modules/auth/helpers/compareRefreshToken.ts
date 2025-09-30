import crypto from 'crypto'

const compareRefreshToken = (token: string, tokenHash: string) => {
  const secret = process.env.REFRESH_HASH_SECRET as string
  const hashToCheck = crypto
    .createHmac('sha256', secret)
    .update(token)
    .digest('hex')

  return crypto.timingSafeEqual(
    Buffer.from(hashToCheck, 'hex'),
    Buffer.from(tokenHash, 'hex')
  )
}

export default compareRefreshToken