import { Accessibility, Place } from '../../database/models'
import { BoundsDTO, CreatePlaceDTO, PlaceDTO } from '../dtos/place'

export class PlaceService {
  public static async getAll(): Promise<Place[]> {
    return Place.findAll()
  }

  public static async getOne(id: string): Promise<Place | null> {
    return Place.findByPk(id)
  }

  public static async getByBounds(bounds: BoundsDTO): Promise<Place[]> {
    return Place.findAll()
  }

  public static async getByOwner(userID: string): Promise<Place[]> {
    return Place.findAll({ where: { userID } })
  }

  public static async create(placeDTO: CreatePlaceDTO): Promise<string> {
    const { owner, ...place } = placeDTO
    const { id } = await Place.create({
      userID: owner,
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
