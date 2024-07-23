import dotenv from 'dotenv'

import { app } from './app'
import { appConfigs } from './configs'
import { connection, migrartionsUp } from './database'

dotenv.config()

const bootstrap = async (): Promise<void> => {
  try {
    await connection.authenticate()
    await migrartionsUp()
    app.listen(appConfigs.port, () => console.log('Server started 🚀'))
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}

bootstrap()
