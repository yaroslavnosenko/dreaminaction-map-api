import { Request, Response, Router } from 'express'

import { UserRole } from '../../consts'
import { IdProp, QueryQuery, UserRoleRequest } from '../dtos'
import {
  validateAuth,
  validateBody,
  validateParams,
  validateQuery,
} from '../middlewares'
import { PlaceService, UserService } from '../services'
import { isMe } from './validations'

const router = Router()

router.get(
  '/',
  validateQuery(QueryQuery),
  validateAuth([UserRole.admin, UserRole.manager]),
  async (req: Request, res: Response) => {
    const query = req.query as QueryQuery
    const users = await UserService.getAll(query)
    return res.status(200).json(users)
  }
)

router.get(
  '/:id',
  validateParams(IdProp),
  validateAuth([UserRole.admin, UserRole.manager], isMe),
  async (req: Request, res: Response) => {
    const { id } = req.params
    const user = await UserService.getOne(id)
    return user ? res.status(200).json(user) : res.status(404).send()
  }
)

router.get(
  '/:id/places',
  validateParams(IdProp),
  validateAuth([UserRole.admin, UserRole.manager], isMe),
  async (req: Request, res: Response) => {
    const { id } = req.params
    const places = await PlaceService.getByOwner(id)
    return res.status(200).json(places)
  }
)

router.put(
  '/:id/role',
  validateParams(IdProp),
  validateBody(UserRoleRequest),
  validateAuth([UserRole.admin]),
  async (req: Request, res: Response) => {
    const { id } = req.params
    const { role } = req.body as UserRoleRequest
    const result = await UserService.setRole(id, role)
    return result ? res.status(200).json({ id }) : res.status(404).send()
  }
)

router.delete(
  '/:id',
  validateAuth([UserRole.admin]),
  validateParams(IdProp),
  async (req: Request, res: Response) => {
    const { id } = req.params
    await UserService.delete(id)
    return res.status(200).send()
  }
)

export const usersRouter = router
