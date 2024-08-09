import { connection } from '../src/database'

beforeEach(async () => {
  await connection.initialize()
  await connection.dropDatabase()
  await connection.synchronize()
})

afterEach(async () => {
  await connection.destroy()
})
