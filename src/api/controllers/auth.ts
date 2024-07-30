import { Request, Response } from 'express'

import { appConfigs, UserRole } from '../../consts'
import { TokenRequest } from '../dtos'
import { AuthService, UserService } from '../services'

export class AuthController {
  public static async auth(req: Request, res: Response) {
    const { provider, token: extToken } = req.body as TokenRequest
    const { email, firstName, lastName } =
      await AuthService.validate3dPartyToken(provider, extToken)
    let user = await UserService.getOneByEmail(email)
    if (!user) {
      const isAdmin = appConfigs.adminEmail === email
      user = await UserService.create(
        email,
        isAdmin ? UserRole.admin : UserRole.user,
        firstName,
        lastName
      )
    }
    res.status(200).json(AuthService.createToken(user.id))
  }
}
