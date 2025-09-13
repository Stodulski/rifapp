import express from 'express'
import cors from 'cors'
const app = express()

import raffleRoutes from './modules/raffles/routes.js'

app.use(express.json())
app.use(cors())

app.use(cors({
  origin: "http://127.0.0.1:5500",
  credentials: true
}))

app.use(raffleRoutes)

app.set('PORT', process.env.PORT || 3000)

export default app

