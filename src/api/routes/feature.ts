import { Request, Response, Router } from 'express'

import { UserRole } from '../../consts'
import { FeatureDTO, IdProp } from '../dtos'
import { validateAuth, validateBody, validateParams } from '../middlewares'
import { FeatureService } from '../services'

const router = Router()

router.post(
  '/',
  validateBody(FeatureDTO),
  validateAuth([UserRole.admin]),
  async (req: Request, res: Response) => {
    try {
      const dto = req.body as FeatureDTO
      const id = await FeatureService.create(dto)
      return res.status(201).json({ id })
    } catch {
      return res.status(500).send()
    }
  }
)

router.get('/', async (_: Request, res: Response) => {
  try {
    const features = await FeatureService.getAll()
    return res.status(200).json(features)
  } catch {
    return res.status(500).send()
  }
})

router.put(
  '/:id',
  validateBody(FeatureDTO),
  validateParams(IdProp),
  validateAuth([UserRole.admin]),
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const dto = req.body as FeatureDTO
      await FeatureService.update(id, dto)
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
  validateParams(IdProp),
  validateAuth([UserRole.admin]),
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      await FeatureService.delete(id)
      return res.status(200).send()
    } catch {
      return res.status(500).send()
    }
  }
)

export const featuresRouter = router
