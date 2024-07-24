import { connection, migrationsDown, migrationsUp } from '../database'

beforeEach(async () => {
  await connection.authenticate()
  await migrationsUp()
})

afterEach(async () => {
  await migrationsDown()
  await connection.close()
})
