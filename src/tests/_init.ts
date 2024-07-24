import { connection, migrationsDown, migrationsUp } from '../database'

beforeAll(async () => {
  await connection.authenticate()
  await migrationsDown()
})

beforeEach(async () => {
  await migrationsUp()
})

afterEach(async () => {
  await migrationsDown()
})

afterAll(async () => {
  await connection.close()
})
