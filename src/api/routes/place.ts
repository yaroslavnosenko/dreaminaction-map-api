import { Router } from 'express'

import { UserRole } from '../../consts'
import { PlaceController } from '../controllers'

import { FeaturesRequest, FiltersQuery, IdProp, PlaceRequest } from '../dtos'

import {
  validateAuth,
  validateBody,
  validateParams,
  validateQuery,
} from '../middlewares'

const router = Router()

router.post(
  '/',
  validateBody(PlaceRequest),
  validateAuth([UserRole.admin, UserRole.manager]),
  PlaceController.createPlace
)

router.get(
  '/',
  validateQuery(FiltersQuery),
  validateAuth([UserRole.admin, UserRole.manager]),
  PlaceController.getPlaces
)

router.get('/map', validateQuery(FiltersQuery), PlaceController.getMapPlaces)

router.get('/:id', validateParams(IdProp), PlaceController.getPlace)

router.put(
  '/:id',
  validateParams(IdProp),
  validateBody(PlaceRequest),
  validateAuth([UserRole.admin, UserRole.manager]),
  PlaceController.updatePlace
)

router.put(
  '/:id/features',
  validateParams(IdProp),
  validateBody(FeaturesRequest),
  validateAuth([UserRole.admin, UserRole.manager]),
  PlaceController.setFeatures
)

router.delete(
  '/:id',
  validateParams(IdProp),
  validateAuth([UserRole.admin]),
  PlaceController.deletePlace
)

export const placesRouter = router
