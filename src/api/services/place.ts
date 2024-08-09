import { plainToInstance } from 'class-transformer'
import { In } from 'typeorm'
import { Accessibility } from '../../consts'
import { Feature, ILike, Place, PlaceFeature, User } from '../../database'
import {
  BoundsQuery,
  FeaturesRequest,
  FiltersQuery,
  PlaceRequest,
} from '../dtos'
import { IdResponse, PlaceResponse } from '../dtos/responses'

export class PlaceService {
  public static async getOne(
    id: string,
    withOwner?: boolean
  ): Promise<PlaceResponse | null> {
    const query = await Place.findOne({
      where: { id },
      relations: { placeFeature: { feature: true } },
    })
    if (!query) return null
    const { placeFeature, userId, ...data } = query
    let result: PlaceResponse = { ...data }
    if (withOwner) {
      const user = await User.findOneBy({ id: userId })
      result.owner = user!
    }
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
    return await Place.find({ where, take: 50 })
  }

  public static async getByBounds(
    request: BoundsQuery
  ): Promise<PlaceResponse[]> {
    const { swLat, swLng, neLat, neLng, accessibilities, ...other } = request
    // TODO bounds
    const filteredAccessibilities = accessibilities
      ? accessibilities.filter((item) => item !== Accessibility.unknown)
      : undefined
    const where = this.buildQuery({
      ...other,
      accessibilities: filteredAccessibilities,
    })
    return Place.find({ take: 50, where })
  }

  public static async getByOwner(userId: string): Promise<PlaceResponse[]> {
    return Place.findBy({ userId })
  }

  public static async create(
    userId: string,
    place: PlaceRequest
  ): Promise<IdResponse> {
    const { id } = await Place.create({
      userId,
      accessibility: Accessibility.unknown,
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

  public static async delete(id: string): Promise<void> {
    await Place.delete(id)
  }

  public static async setOwner(id: string, userId: string): Promise<boolean> {
    try {
      const place = await Place.findOneBy({ id })
      if (!place) return false
      place.userId = userId
      await place.save()
      return true
    } catch {
      return false
    }
  }

  public static async setAccessibility(
    id: string,
    accessibility: Accessibility
  ): Promise<boolean> {
    const place = await Place.findOneBy({ id })
    if (!place) return false
    place.accessibility = accessibility
    await place.save()
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
