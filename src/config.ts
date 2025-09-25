import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
const app = express()
import 'dotenv/config'

import raffleRoutes from './modules/raffles/routes.js'
import authRoutes from './modules/auth/routes.js'
import { errorHandle } from './helpers/apiError.js'

app.use(express.json())
app.use(cookieParser())
app.use(
  cors({
    origin: 'http://127.0.0.1:5500',
    credentials: true
  })
)

app.use(authRoutes)
app.use(raffleRoutes)
app.use(errorHandle)

app.set('PORT', process.env.PORT || 3000)

export default app
