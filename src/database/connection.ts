import { Sequelize } from 'sequelize'
import { appConfigs } from '../configs'

export const connection = new Sequelize({
  dialect: 'postgres',
  host: appConfigs.database.host,
  username: appConfigs.database.user,
  password: appConfigs.database.password,
  database: appConfigs.database.name,
})
