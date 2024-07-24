import { Request, Response, Router } from 'express'

import { UserRole } from '../../consts'
import { IdProp, UserRoleRequest } from '../dtos'
import { validateAuth, validateBody, validateParams } from '../middlewares'
import { PlaceService, UserService } from '../services'
import { isMe } from './validations'

const router = Router()

router.get(
  '/',
  validateAuth([UserRole.admin, UserRole.manager]),
  async (req: Request, res: Response) => {
    try {
      const users = await UserService.getAll()
      return res.status(200).json(users)
    } catch {
      return res.status(500).send()
    }
  }
)

router.get(
  '/:id',
  validateParams(IdProp),
  validateAuth([UserRole.admin, UserRole.manager], isMe),
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const user = await UserService.getOne(id)
      return user ? res.status(200).json(user) : res.status(404).send()
    } catch {
      return res.status(500).send()
    }
  }
)

router.get(
  '/:id/places',
  validateParams(IdProp),
  validateAuth([UserRole.admin, UserRole.manager], isMe),
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const places = await PlaceService.getByOwner(id)
      return res.status(200).json(places)
    } catch {
      return res.status(500).send()
    }
  }
)

router.put(
  '/:id/role',
  validateParams(IdProp),
  validateBody(UserRoleRequest),
  validateAuth([UserRole.admin]),
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const { role } = req.body as UserRoleRequest
      const result = await UserService.setRole(id, role)
      if (!result) {
        return res.status(404).send()
      }
      return res.status(200).json({ id })
    } catch (error) {
      return res.status(500).send()
    }
  }
)

router.delete(
  '/:id',
  validateAuth([UserRole.admin]),
  validateParams(IdProp),
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      await UserService.delete(id)
      return res.status(200).send()
    } catch {
      return res.status(500).send()
    }
  }
)

export const usersRouter = router
