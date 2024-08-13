import { Router } from 'express'

import { UserRole } from '../../consts'
import { UserController } from '../controllers'
import { IdProp, QueryQuery, UserRequest, UserRoleRequest } from '../dtos'
import {
  validateAuth,
  validateBody,
  validateParams,
  validateQuery,
} from '../middlewares'

const router = Router()

router.get(
  '/',
  validateQuery(QueryQuery),
  validateAuth([UserRole.admin]),
  UserController.getUsers
)

router.get(
  '/:id',
  validateParams(IdProp),
  validateAuth([UserRole.admin]),
  UserController.getUser
)

router.post(
  '/',
  validateBody(UserRequest),
  validateAuth([UserRole.admin]),
  UserController.createUser
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
