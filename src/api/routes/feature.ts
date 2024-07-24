import { Request, Response, Router } from 'express'

import { UserRole } from '../../consts'
import { FeatureRequest, IdProp } from '../dtos'
import { validateAuth, validateBody, validateParams } from '../middlewares'
import { FeatureService } from '../services'

const router = Router()

router.post(
  '/',
  validateBody(FeatureRequest),
  validateAuth([UserRole.admin]),
  async (req: Request, res: Response) => {
    const dto = req.body as FeatureRequest
    const id = await FeatureService.create(dto)
    return res.status(201).json(id)
  }
)

router.get('/', async (_: Request, res: Response) => {
  const features = await FeatureService.getAll()
  return res.status(200).json(features)
})

router.put(
  '/:id',
  validateBody(FeatureRequest),
  validateParams(IdProp),
  validateAuth([UserRole.admin]),
  async (req: Request, res: Response) => {
    const { id } = req.params
    const dto = req.body as FeatureRequest
    const isSuccess = await FeatureService.update(id, dto)
    return isSuccess ? res.status(200).json({ id }) : res.status(404).send()
  }
)

router.delete(
  '/:id',
  validateParams(IdProp),
  validateAuth([UserRole.admin]),
  async (req: Request, res: Response) => {
    const { id } = req.params
    await FeatureService.delete(id)
    return res.status(200).send()
  }
)

export const featuresRouter = router
