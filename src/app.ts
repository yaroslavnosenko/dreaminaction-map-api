import 'reflect-metadata'

import express, { Express } from 'express'

import { router } from './api/routes'
import { auth } from './middlewares'

const app: Express = express()
app.use(express.json())
app.use(auth)
app.use(router)

export { app }
