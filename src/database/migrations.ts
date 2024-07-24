import { SequelizeStorage, Umzug } from 'umzug'

import { connection } from './connection'
import { migrations } from './migrations/index'

const umzug = new Umzug({
  migrations,
  context: connection.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize: connection }),
  logger: undefined,
})

export const migrationsUp = async () => {
  await umzug.up()
}

export const migrationsDown = async () => {
  await umzug.down({ to: 0 })
}
