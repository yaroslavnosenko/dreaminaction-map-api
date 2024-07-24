import { NextFunction, Request, Response } from 'express'

import { AuthService, UserService } from '../services'

export const auth = async (req: Request, _: Response, next: NextFunction) => {
  try {
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
    req.user = await UserService.getOne(payload.uid)
    next()
  } catch {
    next()
  }
}
