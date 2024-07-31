import cors from 'cors'
import 'reflect-metadata'

import express, { Express } from 'express'

import { auth } from './api/middlewares'
import { router } from './api/routes'

const app: Express = express()
app.use(cors())
app.use(express.json())
app.use(auth)
app.use(router)

export { app }
