import { Router } from 'express'

import { UserRole } from '../../consts'
import { PlaceController } from '../controllers'

import {
  AccessibilityRequest,
  BoundsQuery,
  FeaturesRequest,
  FiltersQuery,
  IdProp,
  PlaceRequest,
} from '../dtos'

import {
  validateAuth,
  validateBody,
  validateParams,
  validateQuery,
} from '../middlewares'

import { isValidOwner } from './validations'

const router = Router()

router.post(
  '/',
  validateBody(PlaceRequest),
  validateAuth([UserRole.admin, UserRole.manager, UserRole.user]),
  PlaceController.createPlace
)

router.get(
  '/',
  validateQuery(FiltersQuery),
  validateAuth([UserRole.admin, UserRole.manager]),
  PlaceController.getPlaces
)

router.get(
  '/bounds',
  validateQuery(BoundsQuery),
  PlaceController.getPlacesByBounds
)

router.get('/:id', validateParams(IdProp), PlaceController.getPlace)

router.put(
  '/:id',
  validateParams(IdProp),
  validateBody(PlaceRequest),
  validateAuth([UserRole.admin], isValidOwner),
  PlaceController.updatePlace
)

router.put(
  '/:id/owner',
  validateParams(IdProp),
  validateBody(IdProp),
  validateAuth([UserRole.admin]),
  PlaceController.setOwner
)

router.put(
  '/:id/accessibility',
  validateParams(IdProp),
  validateBody(AccessibilityRequest),
  validateAuth([UserRole.admin, UserRole.manager]),
  PlaceController.setAccessibility
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
  validateAuth([UserRole.admin], isValidOwner),
  PlaceController.deletePlace
)

export const placesRouter = router
