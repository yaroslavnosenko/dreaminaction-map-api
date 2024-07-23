import { Feature } from '../../database/models'
import { FeatureDTO } from '../dtos'

export class FeatureService {
  public static async getAll(): Promise<Feature[]> {
    return await Feature.findAll()
  }

  public static async create(feature: FeatureDTO): Promise<string> {
    const { id } = await Feature.create({ ...feature })
    return id
  }

  public static async update(id: string, feature: FeatureDTO): Promise<string> {
    const [count] = await Feature.update({ ...feature }, { where: { id } })
    if (count !== 1) throw new Error('NOT_FOUND')
    return id
  }

  public static async delete(id: string): Promise<void> {
    await Feature.destroy({ where: { id } })
  }
}
