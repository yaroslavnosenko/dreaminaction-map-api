import { Request, Response, Router } from 'express'
import { UserRole } from '../../database/models'
import { validateAuth, validateBody, validateParams } from '../../middlewares'
import {
  AccessibilityDTO,
  BoundsParams,
  IdParams,
  OwnerDTO,
  PlaceDTO,
} from '../dtos'
import { PlaceService } from '../services'

const router = Router()

router.post(
  '/',
  validateBody(PlaceDTO),
  validateAuth(),
  async (req: Request, res: Response) => {
    try {
      const dto = req.body as PlaceDTO
      const id = await PlaceService.create(req.user!.id, dto)
      return res.status(201).json({ id })
    } catch (error) {
      return res.status(500).send()
    }
  }
)

router.get(
  '/',
  validateAuth([UserRole.admin, UserRole.manager]),
  async (req: Request, res: Response) => {
    try {
      const places = await PlaceService.getAll()
      return res.status(200).json(places)
    } catch {
      return res.status(500).send()
    }
  }
)

router.get(
  '/bounds',
  validateParams(BoundsParams),
  async (req: Request, res: Response) => {
    try {
      const bounds = req.params as unknown as BoundsParams
      const places = await PlaceService.getByBounds(bounds)
      return res.status(200).json(places)
    } catch {
      return res.status(500).send()
    }
  }
)

router.get(
  '/:id',
  validateParams(IdParams),
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
  validateParams(IdParams),
  validateBody(PlaceDTO),
  validateAuth(),
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      // Only owner or Admin
      if (req.user?.role !== UserRole.admin) {
        const place = await PlaceService.getOne(id)
        if (place?.userID !== req.user?.id) {
          return res.status(403).send()
        }
      }
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
  validateParams(IdParams),
  validateBody(OwnerDTO),
  validateAuth([UserRole.admin]),
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
  validateParams(IdParams),
  validateBody(AccessibilityDTO),
  validateAuth([UserRole.admin, UserRole.manager]),
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
  validateParams(IdParams),
  validateAuth([UserRole.admin, UserRole.manager]),
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
  validateParams(IdParams),
  validateAuth(),
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      // Only owner or Admin
      if (req.user?.role !== UserRole.admin) {
        const place = await PlaceService.getOne(id)
        if (place?.userID !== req.user?.id) {
          return res.status(403).send()
        }
      }
      await PlaceService.delete(id)
      return res.status(200).send()
    } catch {
      return res.status(500).send()
    }
  }
)

export const placesRouter = router
