import { NextFunction, Request, Response } from 'express'

import { plainToInstance } from 'class-transformer'
import { isArray, validate } from 'class-validator'

type Constructor<T> = { new (...args: any[]): T }

export const validateBody = <T extends object>(type: Constructor<T>) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    if (isArray(req.body)) {
      res.status(400).send()
      return
    }
    const whitelisted = plainToInstance(type, req.body, {
      excludeExtraneousValues: true,
    })
    const errors = await validate(whitelisted)
    req.body = whitelisted
    if (errors.length > 0) {
      res.status(400).send()
    } else {
      next()
    }
  }
}
