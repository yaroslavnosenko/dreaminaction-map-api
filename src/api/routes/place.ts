import { Request, Response, Router } from 'express'

import { UserRole } from '../../consts'
import {
  AccessibilityDTO,
  BoundsQuery,
  FeaturesRequest,
  IdProp,
  PlaceDTO,
} from '../dtos'
import {
  validateAuth,
  validateBody,
  validateParams,
  validateQuery,
} from '../middlewares'
import { PlaceService } from '../services'
import { isValidOwner } from './validations'

const router = Router()

router.post(
  '/',
  validateBody(PlaceDTO),
  validateAuth([UserRole.admin, UserRole.manager, UserRole.user]),
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
  validateQuery(BoundsQuery),
  async (req: Request, res: Response) => {
    try {
      const bounds = req.query as unknown as BoundsQuery
      const places = await PlaceService.getByBounds(bounds)
      return res.status(200).json(places)
    } catch {
      return res.status(500).send()
    }
  }
)

router.get(
  '/:id',
  validateParams(IdProp),
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
  validateParams(IdProp),
  validateBody(PlaceDTO),
  validateAuth([UserRole.admin], isValidOwner),
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
  validateParams(IdProp),
  validateBody(IdProp),
  validateAuth([UserRole.admin]),
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const { id: owner } = req.body as IdProp
      const result = await PlaceService.setOwner(id, owner)
      if (!result) {
        return res.status(404).send()
      }
      return res.status(200).json({ id })
    } catch (error) {
      return res.status(500).send()
    }
  }
)

router.put(
  '/:id/accessibility',
  validateParams(IdProp),
  validateBody(AccessibilityDTO),
  validateAuth([UserRole.admin, UserRole.manager]),
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const { accessibility } = req.body as AccessibilityDTO
      const result = await PlaceService.setAccessibility(id, accessibility)
      if (!result) {
        return res.status(404).send()
      }
      return res.status(200).json({ id })
    } catch (error) {
      return res.status(500).send()
    }
  }
)

router.put(
  '/:id/features',
  validateParams(IdProp),
  validateBody(FeaturesRequest),
  validateAuth([UserRole.admin, UserRole.manager]),
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const body = req.body as FeaturesRequest
      const result = await PlaceService.setFeatures(id, body)
      if (!result) {
        return res.status(400).send()
      }
      return res.status(200).json({ id })
    } catch (error) {
      return res.status(500).send()
    }
  }
)

router.delete(
  '/:id',
  validateParams(IdProp),
  validateAuth([UserRole.admin], isValidOwner),
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
