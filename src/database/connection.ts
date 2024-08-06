import mariadbModule from 'mariadb'
import { Sequelize } from 'sequelize'

import { appConfigs } from '../consts'

export const connection = new Sequelize({
  dialect: 'mariadb',
  dialectModule: mariadbModule,
  host: appConfigs.database.host,
  username: appConfigs.database.user,
  password: appConfigs.database.password,
  database: appConfigs.database.name,
  port: parseInt(appConfigs.database.port),
  logging: false,
})
