import { DataSource } from 'typeorm'

import { appConfigs } from '../consts'
import { Feature, Place, PlaceFeature, User } from './models'

export const connection = new DataSource({
  type: 'mariadb',
  host: appConfigs.database.host,
  username: appConfigs.database.user,
  password: appConfigs.database.password,
  database: appConfigs.database.name,
  port: parseInt(appConfigs.database.port),
  logging: false,
  synchronize: false,
  entities: [User, Place, Feature, PlaceFeature],
})
