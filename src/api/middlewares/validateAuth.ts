import { NextFunction, Request, Response } from 'express'

import { UserRole } from '../../consts'

export const validateAuth = (
  roles: UserRole[],
  orFn?: (req: Request) => Promise<boolean>
) => {
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

    if (roles.includes(user.role)) {
      next()
      return
    }

    if (orFn) {
      const result = await orFn(req)
      if (result) {
        next()
        return
      }
    }

    res.status(403).send()
    return
  }
}