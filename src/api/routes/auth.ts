import { Request, Response, Router } from 'express'
import { appConfigs } from '../../configs'
import { UserRole } from '../../database/models'
import { validateBody } from '../../middlewares'
import { TokenDTO } from '../dtos'
import { AuthService, UserService } from '../services'

const router = Router()

router.post(
  '/',
  validateBody(TokenDTO),
  async (req: Request, res: Response) => {
    try {
      const { provider, token: extToken } = req.body as TokenDTO
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
    } catch {
      res.status(500).send()
    }
  }
)

export const authRouter = router
