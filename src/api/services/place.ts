import { plainToInstance } from 'class-transformer'
import { In } from 'typeorm'
import { Feature, ILike, Place, PlaceFeature } from '../../database'
import {
  FeaturesRequest,
  FiltersQuery,
  IdResponse,
  PlaceRequest,
  PlaceResponse,
} from '../dtos'

export class PlaceService {
  public static async getOne(id: string): Promise<PlaceResponse | null> {
    const query = await Place.findOne({
      where: { id },
      relations: { placeFeature: { feature: true } },
    })
    if (!query) return null
    const { placeFeature, ...data } = query
    let result: PlaceResponse = { ...data }
    result.availableFeatures = []
    result.unavailableFeatures = []
    for (const featureMap of placeFeature) {
      const feat = featureMap.feature
      if (featureMap.available) {
        result.availableFeatures.push(feat)
      } else {
        result.unavailableFeatures.push(feat)
      }
    }
    return plainToInstance(PlaceResponse, result, {
      excludeExtraneousValues: true,
    })
  }

  public static async getAll(request: FiltersQuery): Promise<PlaceResponse[]> {
    const where = this.buildQuery(request)
    return await Place.find({ where })
  }

  public static async create(place: PlaceRequest): Promise<IdResponse> {
    const { id } = await Place.create({
      ...place,
    }).save()
    return { id }
  }

  public static async update(
    id: string,
    place: PlaceRequest
  ): Promise<boolean> {
    const dbPlace = await Place.findOneBy({ id })
    if (!dbPlace) return false
    const updated = Place.create({ ...dbPlace, ...place })
    await updated.save()
    return true
  }

  static async setFeatures(
    id: string,
    { features }: FeaturesRequest
  ): Promise<boolean | null> {
    const place = await Place.findOneBy({ id })
    if (!place) return null

    const newIds = features.map((feat) => feat.id)
    if (newIds.length === 0) {
      await PlaceFeature.delete({ placeId: id })
      return true
    }

    const dbFeatures = await Feature.findBy({ id: In(newIds) })
    if (dbFeatures.length !== newIds.length) {
      return false
    }

    await PlaceFeature.delete({ placeId: id })

    await PlaceFeature.save(
      features.map((feat) =>
        PlaceFeature.create({
          placeId: id,
          featureId: feat.id,
          available: feat.available,
        })
      )
    )
    return true
  }

  public static async delete(id: string): Promise<void> {
    await Place.delete(id)
  }

  private static buildQuery(filters: FiltersQuery) {
    const { categories, accessibilities } = filters
    const query = filters.query ? filters.query : false
    const where = {} as any
    if (categories) where.category = In(categories)
    if (accessibilities && accessibilities.length > 0)
      where.accessibility = In(accessibilities)
    if (query) where.name = ILike(query)
    return where
  }
}
