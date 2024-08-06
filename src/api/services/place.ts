import { plainToInstance } from 'class-transformer'
import { Op } from 'sequelize'
import { Accessibility } from '../../consts'
import { Feature, Place, PlaceFeature, User } from '../../database'
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
    const query = await Place.findByPk(id)
    if (!query) return null
    const result: PlaceResponse = query.dataValues
    if (withOwner) {
      const user = await User.findByPk(query.userID)
      result.owner = user!
    }
    const placeFeaturesQuery = await PlaceFeature.findAll({
      where: { placeID: id },
      include: Feature,
    })

    result.availableFeatures = []
    result.unavailableFeatures = []

    for (const feature of placeFeaturesQuery) {
      const feat = feature.Feature!.dataValues
      if (feature.available) {
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
    const whereArray = this.buildQuery(request)
    return Place.findAll({
      where: { [Op.and]: whereArray },
    })
  }

  public static async getByBounds(
    request: BoundsQuery
  ): Promise<PlaceResponse[]> {
    const { swLat, swLng, neLat, neLng, accessibilities, ...other } = request
    const filteredAccessibilities = accessibilities
      ? accessibilities.filter((item) => item !== Accessibility.unknown)
      : undefined
    const whereArray = this.buildQuery({
      ...other,
      accessibilities: filteredAccessibilities,
    })
    return Place.findAll({
      limit: 100,
      where: {
        [Op.and]: [
          { lat: { [Op.between]: [swLat, neLat] } },
          { lng: { [Op.between]: [swLng, neLng] } },
          { accessibility: { [Op.not]: Accessibility.unknown } },
          ...whereArray,
        ],
      },
    })
  }

  public static async getByOwner(userID: string): Promise<PlaceResponse[]> {
    return Place.findAll({ where: { userID } })
  }

  public static async create(
    userID: string,
    place: PlaceRequest
  ): Promise<IdResponse> {
    const { id } = await Place.create({
      userID,
      accessibility: Accessibility.unknown,
      ...place,
    })
    return { id }
  }

  public static async update(
    id: string,
    place: PlaceRequest
  ): Promise<boolean> {
    const [count] = await Place.update({ ...place }, { where: { id } })
    return count === 1
  }

  public static async delete(id: string): Promise<void> {
    await Place.destroy({ where: { id } })
  }

  public static async setOwner(id: string, userID: string): Promise<boolean> {
    try {
      const [count] = await Place.update({ userID }, { where: { id } })
      return count === 1
    } catch {
      return false
    }
  }

  public static async setAccessibility(
    id: string,
    accessibility: Accessibility
  ): Promise<boolean> {
    const [count] = await Place.update({ accessibility }, { where: { id } })
    return count === 1
  }

  static async setFeatures(
    id: string,
    { features }: FeaturesRequest
  ): Promise<boolean | null> {
    const place = await Place.findByPk(id)
    if (!place) return null

    const newIds = features.map((feat) => feat.id)
    if (newIds.length === 0) {
      await PlaceFeature.destroy({ where: { placeID: id } })
      return true
    }

    const dbFeatures = await Feature.findAll({ where: { id: newIds } })
    if (dbFeatures.length !== newIds.length) {
      return false
    }

    await PlaceFeature.destroy({ where: { placeID: id } })

    const newPlaceFeatures = features.map((feat) => ({
      placeID: id,
      featureID: feat.id,
      available: feat.available,
    }))
    await PlaceFeature.bulkCreate(newPlaceFeatures)

    return true
  }

  private static buildQuery(filters: FiltersQuery) {
    const { categories, accessibilities } = filters
    const query = filters.query ? `%${filters.query}%` : false
    const whereArray = []
    if (categories) whereArray.push({ category: { [Op.in]: categories } })
    if (accessibilities && accessibilities.length > 0)
      whereArray.push({ accessibility: { [Op.in]: accessibilities } })
    if (query) whereArray.push({ name: { [Op.like]: query } })
    return whereArray
  }
}
