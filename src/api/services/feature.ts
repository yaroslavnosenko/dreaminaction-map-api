import { Feature } from '../../database'
import { FeatureRequest } from '../dtos'
import { FeatureResponse, IdResponse } from '../dtos/responses'

export class FeatureService {
  public static async getAll(): Promise<FeatureResponse[]> {
    return await Feature.find()
  }

  public static async create(feature: FeatureRequest): Promise<IdResponse> {
    const { id } = await Feature.create({ ...feature }).save()
    return { id }
  }

  public static async update(
    id: string,
    feature: FeatureRequest
  ): Promise<boolean> {
    const feat = await Feature.findOneBy({ id })
    if (!feat) return false
    feat.name = feature.name
    await feat.save()
    return true
  }

  public static async delete(id: string): Promise<void> {
    await Feature.delete(id)
  }
}
