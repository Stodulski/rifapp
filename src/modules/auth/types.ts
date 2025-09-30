export type AccessTokenPayload = {
  userId: string
  iat: number
  exp: number
}

export type RefreshTokenPayload = {
  userId: string
  jti:string
  iat: number
  exp: number
}

export type NewRefreshToken = {
  jti: string
  userId: string
  agent?: string | null
  ip?: string | null
  tokenHash: string,
  remplacedByToken?: string | null
}

export type SessionTokens = {
  accessToken: string
  csrfToken: string
  refreshToken: string
}
