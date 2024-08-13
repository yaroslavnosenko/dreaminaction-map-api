import { Request, Response } from 'express'

import { Accessibility } from '../../consts'
import { FeaturesRequest, FiltersQuery, PlaceRequest } from '../dtos'
import { PlaceService } from '../services'

export class PlaceController {
  public static async getPlace(req: Request, res: Response) {
    const { id } = req.params
    const place = await PlaceService.getOne(id)
    place ? res.status(200).json(place) : res.status(404).send()
  }

  public static async getPlaces(req: Request, res: Response) {
    const query = req.query as FiltersQuery
    const places = await PlaceService.getAll(query)
    res.status(200).json(places)
  }

  public static async getMapPlaces(req: Request, res: Response) {
    const query = req.query as FiltersQuery
    const places = await PlaceService.getAll(query)
    const filtered = places.filter(
      (place) => place.accessibility !== Accessibility.unknown
    )
    res.status(200).json(filtered)
  }

  public static async createPlace(req: Request, res: Response) {
    const place = req.body as PlaceRequest
    const id = await PlaceService.create(place)
    res.status(201).json(id)
  }

  public static async updatePlace(req: Request, res: Response) {
    const { id } = req.params
    const place = req.body as PlaceRequest
    const isSuccess = await PlaceService.update(id, place)
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
