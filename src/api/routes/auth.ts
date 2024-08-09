import { Router } from 'express'

import { AuthController } from '../controllers'
import { SendOtpRequest, ValidateOtpRequest } from '../dtos'
import { validateBody } from '../middlewares'

const router = Router()

router.post('/otp', validateBody(SendOtpRequest), AuthController.sendOtp)

router.post(
  '/otp/validate',
  validateBody(ValidateOtpRequest),
  AuthController.validateOtp
)

export const authRouter = router
