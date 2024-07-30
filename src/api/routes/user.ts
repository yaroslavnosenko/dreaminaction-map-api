import { Router } from 'express'

import { UserRole } from '../../consts'
import { UserController } from '../controllers'
import { IdProp, QueryQuery, UserRoleRequest } from '../dtos'
import {
  validateAuth,
  validateBody,
  validateParams,
  validateQuery,
} from '../middlewares'
import { isMe } from './validations'

const router = Router()

router.get(
  '/',
  validateQuery(QueryQuery),
  validateAuth([UserRole.admin, UserRole.manager]),
  UserController.getUsers
)

router.get(
  '/:id',
  validateParams(IdProp),
  validateAuth([UserRole.admin, UserRole.manager], isMe),
  UserController.getUser
)

router.get(
  '/:id/places',
  validateParams(IdProp),
  validateAuth([UserRole.admin, UserRole.manager], isMe),
  UserController.getUserPlaces
)

router.put(
  '/:id/role',
  validateParams(IdProp),
  validateBody(UserRoleRequest),
  validateAuth([UserRole.admin]),
  UserController.setRole
)

router.delete(
  '/:id',
  validateAuth([UserRole.admin]),
  validateParams(IdProp),
  UserController.deleteUser
)

export const usersRouter = router
