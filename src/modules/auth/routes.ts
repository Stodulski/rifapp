import { Router } from 'express'
import {
  loginController,
  registerController,
  logoutController,
  checkRefreshController
} from './controllers.js'
import parseZodSchema from '../../middlewares/parseZodSchema.js'
import { loginSchema, registerSchema } from './schemas.js'
import { verifyCsrf, verifySession } from './middlewares/verifyAuth.js'
const router = Router()

router.post('/sessions/login', parseZodSchema(loginSchema), loginController)

router.post(
  '/sessions/register',
  parseZodSchema(registerSchema),
  registerController
)
router.get('/', verifySession, (req, res)=>{
  res.json({message:"Hola"})
})
router.delete('/sessions/me', verifyCsrf, logoutController)

router.post('/sessions/checkRefresh', verifyCsrf, checkRefreshController)

export default router
