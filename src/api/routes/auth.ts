import { Router } from 'express'

import { AuthController } from '../controllers'
import { TokenRequest } from '../dtos'
import { validateBody } from '../middlewares'

const router = Router()

router.post('/', validateBody(TokenRequest), AuthController.auth)

export const authRouter = router
