import { SequelizeStorage, Umzug } from 'umzug'
import { connection } from './connection'

export const runMigrations = async () => {
  const umzug = new Umzug({
    migrations: { glob: 'src/database/migrations/*.ts' },
    context: connection.getQueryInterface(),
    storage: new SequelizeStorage({ sequelize: connection }),
    logger: console,
  })

  await umzug.up({})
}
