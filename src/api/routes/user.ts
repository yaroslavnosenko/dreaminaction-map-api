import { Request, Response, Router } from 'express'
import { validateBody, validateParams } from '../../middlewares'
import { IdDTO, UserRoleDTO } from '../dtos'
import { PlaceService, UserService } from '../services'

const router = Router()

router.get('/', async (req: Request, res: Response) => {
  try {
    const users = await UserService.getAll()
    return res.status(200).json(users)
  } catch {
    return res.status(500).send()
  }
})

router.get(
  '/:id',
  validateParams(IdDTO),
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const user = await UserService.getOne(id)
      return user ? res.status(200).json(user) : res.status(404)
    } catch {
      return res.status(500).send()
    }
  }
)

router.get(
  '/:id/places',
  validateParams(IdDTO),
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
  validateParams(IdDTO),
  validateBody(UserRoleDTO),
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const { role } = req.body as UserRoleDTO
      await UserService.setRole(id, role)
      return res.status(200).json({ id })
    } catch (error) {
      if (error instanceof Error && error.message === 'NOT_FOUND') {
        return res.status(404).send()
      }
      return res.status(500).send()
    }
  }
)

router.delete(
  '/:id',
  validateParams(IdDTO),
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