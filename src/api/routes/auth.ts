import { Router } from 'express'

import { UserRole } from '../../consts'
import { AuthController } from '../controllers'
import { SendOtpRequest, ValidateOtpRequest } from '../dtos'
import { validateAuth, validateBody } from '../middlewares'

const router = Router()

router.post(
  '/me',
  validateAuth([UserRole.admin, UserRole.manager]),
  AuthController.me
)

router.post('/otp', validateBody(SendOtpRequest), AuthController.sendOtp)

router.post(
  '/otp/validate',
  validateBody(ValidateOtpRequest),
  AuthController.validateOtp
)

export const authRouter = router
