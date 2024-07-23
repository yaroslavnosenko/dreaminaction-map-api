import { Feature, Place, PlaceFeature, User } from './models'

export const initDatabase = async () => {
  await User.sync()
  await Feature.sync()
  await Place.sync()
  await Place.sync()
  await PlaceFeature.sync()
}
