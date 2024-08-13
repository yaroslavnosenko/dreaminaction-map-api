import { Request, Response } from 'express'

import { appConfigs, UserRole } from '../../consts'
import { SendOtpRequest, ValidateOtpRequest } from '../dtos'
import { AuthService, UserService } from '../services'

export class AuthController {
  public static async me(req: Request, res: Response) {
    return res.status(200).json(req.user)
  }

  public static async sendOtp(req: Request, res: Response) {
    const { email } = req.body as SendOtpRequest
    const user = await UserService.getOneByEmail(email)

    if (!user) {
      if (email === appConfigs.adminEmail) {
        await UserService.create(email, UserRole.admin)
      } else {
        return res.status(400).send()
      }
    }

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
    res.status(200).json(AuthService.createToken(user!.id))
  }
}
