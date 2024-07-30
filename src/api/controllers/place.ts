import { Request, Response } from 'express'

import { UserRole } from '../../consts'
import {
  AccessibilityRequest,
  BoundsQuery,
  FeaturesRequest,
  FiltersQuery,
  IdProp,
  PlaceRequest,
} from '../dtos'
import { PlaceService } from '../services'

export class PlaceController {
  public static async getPlace(req: Request, res: Response) {
    const roleMaybe = req.user?.role
    const withOwner =
      roleMaybe === UserRole.admin || roleMaybe === UserRole.manager
    const { id } = req.params
    const place = await PlaceService.getOne(id, withOwner)
    place ? res.status(200).json(place) : res.status(404).send()
  }

  public static async getPlaces(req: Request, res: Response) {
    const query = req.query as FiltersQuery
    const places = await PlaceService.getAll(query)
    res.status(200).json(places)
  }

  public static async getPlacesByBounds(req: Request, res: Response) {
    const bounds = req.query as unknown as BoundsQuery
    const places = await PlaceService.getByBounds(bounds)
    res.status(200).json(places)
  }

  public static async createPlace(req: Request, res: Response) {
    const dto = req.body as PlaceRequest
    const id = await PlaceService.create(req.user!.id, dto)
    res.status(201).json(id)
  }

  public static async updatePlace(req: Request, res: Response) {
    const { id } = req.params
    const place = req.body as PlaceRequest
    const isSuccess = await PlaceService.update(id, place)
    isSuccess ? res.status(200).json({ id }) : res.status(404).send()
  }

  public static async setOwner(req: Request, res: Response) {
    const { id } = req.params
    const { id: owner } = req.body as IdProp
    const isSuccess = await PlaceService.setOwner(id, owner)
    isSuccess ? res.status(200).json({ id }) : res.status(404).send()
  }

  public static async setAccessibility(req: Request, res: Response) {
    const { id } = req.params
    const { accessibility } = req.body as AccessibilityRequest
    const isSuccess = await PlaceService.setAccessibility(id, accessibility)
    isSuccess ? res.status(200).json({ id }) : res.status(404).send()
  }

  public static async setFeatures(req: Request, res: Response) {
    const { id } = req.params
    const body = req.body as FeaturesRequest
    const result = await PlaceService.setFeatures(id, body)
    if (result === null) {
      return res.status(404).send()
    }
    result ? res.status(200).json({ id }) : res.status(400).send()
  }

  public static async deletePlace(req: Request, res: Response) {
    await PlaceService.delete(req.params.id)
    res.status(200).send()
  }
}
