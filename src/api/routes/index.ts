import { Router } from 'express'
import { authRouter } from './auth'
import { featuresRouter } from './feature'
import { placesRouter } from './place'
import { usersRouter } from './user'

const router = Router()

router.use('/auth', authRouter)
router.use('/users', usersRouter)
router.use('/places', placesRouter)
router.use('/features', featuresRouter)

export { router }
