import 'reflect-metadata'

import dotenv from 'dotenv'
import express, { Express } from 'express'

import { router } from './api/routes'
import { appConfigs } from './configs'
import { connection, runMigrations } from './database'
import { auth } from './middlewares'

dotenv.config()

const app: Express = express()
app.use(express.json())
app.use(auth)
app.use(router)

const bootstrap = async (): Promise<void> => {
  try {
    await connection.authenticate()
    await runMigrations()
    app.listen(appConfigs.port, () => console.log('Server started!'))
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}

bootstrap()
