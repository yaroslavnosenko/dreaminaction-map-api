import { Request, Response } from 'express'

import { appConfigs, UserRole } from '../../consts'
import { SendOtpRequest, ValidateOtpRequest } from '../dtos'
import { AuthService, UserService } from '../services'

export class AuthController {
  public static async sendOtp(req: Request, res: Response) {
    const { email } = req.body as SendOtpRequest
    const isSent = await AuthService.sendOtp(email)
    return isSent ? res.status(200).send() : res.status(400).send()
  }

  public static async validateOtp(req: Request, res: Response) {
    const { email, otp } = req.body as ValidateOtpRequest
    const isValid = await AuthService.validateOtp(email, otp)
    if (!isValid) {
      return res.status(400).send()
    }
    let user = await UserService.getOneByEmail(email)
    if (!user) {
      const isAdmin = appConfigs.adminEmail === email
      user = await UserService.create(
        email,
        isAdmin ? UserRole.admin : UserRole.user
      )
    }
    res.status(200).json(AuthService.createToken(user.id))
  }
}
