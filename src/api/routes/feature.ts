import { Request, Response, Router } from 'express'
import { validateBody, validateParams } from '../../middlewares'
import { FeatureDTO, IdDTO } from '../dtos'
import { FeatureService } from '../services'

const router = Router()

router.post(
  '/',
  validateBody(FeatureDTO),
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
  validateParams(IdDTO),
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
  validateParams(IdDTO),
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