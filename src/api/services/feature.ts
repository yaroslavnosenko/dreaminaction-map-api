import { Feature } from '../../database'
import { FeatureRequest } from '../dtos'
import { FeatureResponse, IdResponse } from '../dtos/responses'

export class FeatureService {
  public static async getAll(): Promise<FeatureResponse[]> {
    return await Feature.findAll()
  }

  public static async create(feature: FeatureRequest): Promise<IdResponse> {
    const { id } = await Feature.create({ ...feature })
    return { id }
  }

  public static async update(
    id: string,
    feature: FeatureRequest
  ): Promise<boolean> {
    const [count] = await Feature.update({ ...feature }, { where: { id } })
    return count === 1
  }

  public static async delete(id: string): Promise<void> {
    await Feature.destroy({ where: { id } })
  }
}
