import dotenv from 'dotenv'
import path from 'path'
dotenv.config({ path: path.resolve(__dirname, '.env') })

import { app } from './app'
import { appConfigs } from './consts'
import { connection } from './database'

const bootstrap = async (): Promise<void> => {
  try {
    await connection.initialize()
    await connection.synchronize()
    app.listen(appConfigs.port, () => console.log('Server started 🚀'))
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}

bootstrap()
