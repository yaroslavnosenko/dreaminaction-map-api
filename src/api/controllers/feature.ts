import { Request, Response } from 'express'

import { FeatureRequest } from '../dtos'
import { FeatureService } from '../services'

export class FeatureController {
  public static async getFeatures(_: Request, res: Response) {
    const features = await FeatureService.getAll()
    res.status(200).json(features)
  }

  public static async createFeature(req: Request, res: Response) {
    const dto = req.body as FeatureRequest
    const id = await FeatureService.create(dto)
    res.status(201).json(id)
  }

  public static async updateFeature(req: Request, res: Response) {
    const { id } = req.params
    const dto = req.body as FeatureRequest
    const isSuccess = await FeatureService.update(id, dto)
    isSuccess ? res.status(200).json({ id }) : res.status(404).send()
  }

  public static async deleteFeature(req: Request, res: Response) {
    const { id } = req.params
    await FeatureService.delete(id)
    res.status(200).send()
  }
}
