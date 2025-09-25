import { Router } from 'express'
import { loginController, registerController } from './controllers.js'
import parseZodSchema from '../../middlewares/parseZodSchema.js'
import { loginSchema, registerSchema } from './schemas.js'
const router = Router()

router.post('/sessions/login', parseZodSchema(loginSchema), loginController)

router.post(
  '/sessions/register',
  parseZodSchema(registerSchema),
  registerController
)

export default router
