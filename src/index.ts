import dotenv from 'dotenv'
import path from 'path'
dotenv.config({ path: path.resolve(__dirname, '.env') })

console.log(process.env.DATABASE_HOST)

import { app } from './app'
import { appConfigs } from './consts'
import { connection, migrationsUp } from './database'

const bootstrap = async (): Promise<void> => {
  try {
    await connection.authenticate()
    await migrationsUp()
    app.listen(appConfigs.port, () => console.log('Server started 🚀'))
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}

bootstrap()
