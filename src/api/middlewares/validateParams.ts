import { NextFunction, Request, Response } from 'express'

import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'

type Constructor<T> = { new (...args: any[]): T }

export const validateParams = <T extends object>(type: Constructor<T>) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const errors = await validate(
      plainToInstance(type, req.params, { excludeExtraneousValues: true })
    )
    if (errors.length > 0) {
      res.status(400).send()
    } else {
      next()
    }
  }
}
