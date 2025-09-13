import {Router} from 'express'
const router = Router()
import { createRaffleController, getRaffleController } from './controllers.js'

router.post('/raffles', createRaffleController)

router.get('/raffles/:id', getRaffleController)

export default router