import { Sequelize } from 'sequelize'

import { appConfigs } from '../consts'

export const connection = new Sequelize({
  dialect: 'postgres',
  host: appConfigs.database.host,
  username: appConfigs.database.user,
  password: appConfigs.database.password,
  database: appConfigs.database.name,
  logging: false,
})
