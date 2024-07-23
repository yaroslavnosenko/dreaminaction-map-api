import { Router } from 'express'

const router = Router()

router.post('/', (req, res) => {
  return res.json({ model: 'users' })
})

export const authRouter = router
