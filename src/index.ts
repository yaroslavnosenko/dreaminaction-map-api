import dotenv from 'dotenv'
dotenv.config()

import { app } from './app'
import { appConfigs } from './consts'
import { connection, migrationsUp } from './database'

console.log(process.env.DATABASE_HOST)

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
