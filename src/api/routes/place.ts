import { Request, Response, Router } from 'express'
import { validateBody, validateParams } from '../../middlewares'
import {
  AccessibilityDTO,
  BoundsDTO,
  CreatePlaceDTO,
  IdDTO,
  OwnerDTO,
  PlaceDTO,
} from '../dtos'
import { PlaceService, UserService } from '../services'

const router = Router()

router.post('/', validateBody(CreatePlaceDTO), async (req, res) => {
  try {
    const dto = req.body as CreatePlaceDTO
    const user = await UserService.getOne(dto.owner)
    if (!user) {
      return res.status(404).send()
    }
    const id = await PlaceService.create(dto)
    return res.status(201).json({ id })
  } catch (error) {
    return res.status(500).send()
  }
})

router.get('/', async (req: Request, res: Response) => {
  try {
    const places = await PlaceService.getAll()
    return res.status(200).json(places)
  } catch {
    return res.status(500).send()
  }
})

router.get(
  '/bounds',
  validateParams(BoundsDTO),
  async (req: Request, res: Response) => {
    try {
      const bounds = req.params as unknown as BoundsDTO
      const places = await PlaceService.getByBounds(bounds)
      return res.status(200).json(places)
    } catch {
      return res.status(500).send()
    }
  }
)

router.get(
  '/:id',
  validateParams(IdDTO),
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const place = await PlaceService.getOne(id)
      return place ? res.status(200).json(place) : res.status(404).send()
    } catch {
      return res.status(500).send()
    }
  }
)

router.put(
  '/:id',
  validateParams(IdDTO),
  validateBody(PlaceDTO),
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const place = req.body as PlaceDTO
      const updated = await PlaceService.update(id, place)
      return res.status(200).json({ id: updated })
    } catch (error) {
      if (error instanceof Error && error.message === 'NOT_FOUND') {
        return res.status(404).send()
      }
      return res.status(500).send()
    }
  }
)

router.put(
  '/:id/owner',
  validateParams(IdDTO),
  validateBody(OwnerDTO),
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const { owner } = req.body as OwnerDTO
      await PlaceService.setOwner(id, owner)
      return res.status(200).json({ id })
    } catch (error) {
      if (error instanceof Error && error.message === 'NOT_FOUND') {
        return res.status(404).send()
      }
      return res.status(500).send()
    }
  }
)

router.put(
  '/:id/accessibility',
  validateParams(IdDTO),
  validateBody(AccessibilityDTO),
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const { accessibility } = req.body as AccessibilityDTO
      await PlaceService.setAccessibility(id, accessibility)
      return res.status(200).json({ id })
    } catch (error) {
      if (error instanceof Error && error.message === 'NOT_FOUND') {
        return res.status(404).send()
      }
      return res.status(500).send()
    }
  }
)

router.put(
  '/:id/features',
  validateParams(IdDTO),
  async (req: Request, res: Response) => {
    try {
      // TODO Implement
      return res.status(200).send()
    } catch (error) {
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
      await PlaceService.delete(id)
      return res.status(200).send()
    } catch {
      return res.status(500).send()
    }
  }
)

export const placesRouter = router
