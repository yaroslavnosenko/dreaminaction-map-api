import { Router } from 'express'

import { UserRole } from '../../consts'
import { FeatureController } from '../controllers'
import { FeatureRequest, IdProp } from '../dtos'
import { validateAuth, validateBody, validateParams } from '../middlewares'

const router = Router()

router.post(
  '/',
  validateBody(FeatureRequest),
  validateAuth([UserRole.admin]),
  FeatureController.createFeature
)

router.get('/', FeatureController.getFeatures)

router.put(
  '/:id',
  validateBody(FeatureRequest),
  validateParams(IdProp),
  validateAuth([UserRole.admin]),
  FeatureController.updateFeature
)

router.delete(
  '/:id',
  validateParams(IdProp),
  validateAuth([UserRole.admin]),
  FeatureController.deleteFeature
)

export const featuresRouter = router
