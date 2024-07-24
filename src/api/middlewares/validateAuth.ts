import { NextFunction, Request, Response } from 'express'

import { UserRole } from '../../consts'

export const validateAuth = (roles?: UserRole[]) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const user = req.user
    if (!user) {
      res.status(403).send()
      return
    }
    if (roles && !roles.includes(user.role)) {
      res.status(403).send()
      return
    }
    next()
  }
}
