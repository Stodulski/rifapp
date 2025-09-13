import express from 'express'
const app = express()

import raffleRoutes from './modules/raffles/routes.js'

app.use(express.json())

app.use(raffleRoutes)

app.set('PORT', process.env.PORT || 3000)

export default app

