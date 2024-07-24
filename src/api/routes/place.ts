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
    const dto = req.body as PlaceDTO
    const id = await PlaceService.create(req.user!.id, dto)
    return res.status(201).json({ id })
  }
)

router.get(
  '/',
  validateAuth([UserRole.admin, UserRole.manager]),
  async (_: Request, res: Response) => {
    const places = await PlaceService.getAll()
    return res.status(200).json(places)
  }
)

router.get(
  '/bounds',
  validateQuery(BoundsQuery),
  async (req: Request, res: Response) => {
    const bounds = req.query as unknown as BoundsQuery
    const places = await PlaceService.getByBounds(bounds)
    return res.status(200).json(places)
  }
)

router.get(
  '/:id',
  validateParams(IdProp),
  async (req: Request, res: Response) => {
    const { id } = req.params
    const place = await PlaceService.getOne(id)
    return place ? res.status(200).json(place) : res.status(404).send()
  }
)

router.put(
  '/:id',
  validateParams(IdProp),
  validateBody(PlaceDTO),
  validateAuth([UserRole.admin], isValidOwner),
  async (req: Request, res: Response) => {
    const { id } = req.params
    const place = req.body as PlaceDTO
    const isSuccess = await PlaceService.update(id, place)
    return isSuccess ? res.status(200).json({ id }) : res.status(404).send()
  }
)

router.put(
  '/:id/owner',
  validateParams(IdProp),
  validateBody(IdProp),
  validateAuth([UserRole.admin]),
  async (req: Request, res: Response) => {
    const { id } = req.params
    const { id: owner } = req.body as IdProp
    const isSuccess = await PlaceService.setOwner(id, owner)
    return isSuccess ? res.status(200).json({ id }) : res.status(404).send()
  }
)

router.put(
  '/:id/accessibility',
  validateParams(IdProp),
  validateBody(AccessibilityDTO),
  validateAuth([UserRole.admin, UserRole.manager]),
  async (req: Request, res: Response) => {
    const { id } = req.params
    const { accessibility } = req.body as AccessibilityDTO
    const isSuccess = await PlaceService.setAccessibility(id, accessibility)
    return isSuccess ? res.status(200).json({ id }) : res.status(404).send()
  }
)

router.put(
  '/:id/features',
  validateParams(IdProp),
  validateBody(FeaturesRequest),
  validateAuth([UserRole.admin, UserRole.manager]),
  async (req: Request, res: Response) => {
    const { id } = req.params
    const body = req.body as FeaturesRequest
    const result = await PlaceService.setFeatures(id, body)
    if (result === null) {
      return res.status(404).send()
    }
    return result ? res.status(200).json({ id }) : res.status(400).send()
  }
)

router.delete(
  '/:id',
  validateParams(IdProp),
  validateAuth([UserRole.admin], isValidOwner),
  async (req: Request, res: Response) => {
    await PlaceService.delete(req.params.id)
    return res.status(200).send()
  }
)

export const placesRouter = router
