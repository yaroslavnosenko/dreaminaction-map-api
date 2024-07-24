import { Accessibility } from '../../consts'
import { Feature, Place, PlaceFeature } from '../../database'
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
    return Place.findByPk(id)
  }

  public static async getAll(query: FiltersQuery): Promise<PlaceResponse[]> {
    return Place.findAll()
  }

  public static async getByBounds(
    bounds: BoundsQuery
  ): Promise<PlaceResponse[]> {
    return Place.findAll()
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
    const [count] = await Place.update({ userID }, { where: { id } })
    return count === 1
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
}
