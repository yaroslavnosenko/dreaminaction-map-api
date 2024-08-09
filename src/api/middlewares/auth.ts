import { NextFunction, Request, Response } from 'express'

import { User } from '../../database'
import { AuthService } from '../services'

export const auth = async (req: Request, _: Response, next: NextFunction) => {
  const header = req.headers['authorization'] || ''
  req.user = null
  if (!header) {
    return next()
  }
  const token = header.split(' ')[1]
  const payload = AuthService.validateToken(token)
  if (!payload) {
    return next()
  }
  req.user = await User.findOneBy({ id: payload.uid })
  next()
}
