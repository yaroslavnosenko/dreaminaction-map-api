import { Accessibility } from '../../consts'
import { Place } from '../../database'
import { BoundsParams, PlaceDTO } from '../dtos'

export class PlaceService {
  public static async getAll(): Promise<Place[]> {
    return Place.findAll()
  }

  public static async getOne(id: string): Promise<Place | null> {
    return Place.findByPk(id)
  }

  public static async getByBounds(bounds: BoundsParams): Promise<Place[]> {
    return Place.findAll()
  }

  public static async getByOwner(userID: string): Promise<Place[]> {
    return Place.findAll({ where: { userID } })
  }

  public static async create(userID: string, place: PlaceDTO): Promise<string> {
    const { id } = await Place.create({
      userID,
      accessibility: Accessibility.unknown,
      ...place,
    })
    return id
  }

  public static async update(id: string, place: PlaceDTO): Promise<string> {
    const [count] = await Place.update({ ...place }, { where: { id } })
    if (count !== 1) throw new Error('NOT_FOUND')
    return id
  }

  public static async delete(id: string): Promise<void> {
    await Place.destroy({ where: { id } })
  }

  public static async setOwner(id: string, userID: string): Promise<string> {
    const [count] = await Place.update({ userID }, { where: { id } })
    if (count !== 1) throw new Error('NOT_FOUND')
    return id
  }

  public static async setAccessibility(
    id: string,
    accessibility: Accessibility
  ): Promise<string> {
    const [count] = await Place.update({ accessibility }, { where: { id } })
    if (count !== 1) throw new Error('NOT_FOUND')
    return id
  }
}
