import { Request, Response, Router } from 'express'

import { appConfigs, UserRole } from '../../consts'
import { TokenRequest } from '../dtos'
import { validateBody } from '../middlewares'
import { AuthService, UserService } from '../services'

const router = Router()

router.post(
  '/',
  validateBody(TokenRequest),
  async (req: Request, res: Response) => {
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
    const token = AuthService.createToken(user.id)
    return res.status(200).json({ token })
  }
)

export const authRouter = router
