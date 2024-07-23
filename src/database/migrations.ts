import { SequelizeStorage, Umzug } from 'umzug'
import { connection } from './connection'

const umzug = new Umzug({
  migrations: { glob: 'src/database/migrations/*.{js,ts}' },
  context: connection.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize: connection }),
  logger: console,
})

export const migrartionsUp = async () => {
  await umzug.up()
}

export const migrartionsDown = async () => {
  await umzug.down()
}
