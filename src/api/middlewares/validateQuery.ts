import { NextFunction, Request, Response } from 'express'

import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'
import { Accessibility, Category } from '../../consts'
import { FiltersQuery } from '../dtos'

type Constructor<T> = { new (...args: any[]): T }

export const validateQuery = <T extends object>(type: Constructor<T>) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const whitelisted = plainToInstance(type, req.query, {
      excludeExtraneousValues: true,
    })

    // Filters
    if (typeof req.query.categories === 'string') {
      const categories = req.query.categories.split(',')
      ;(whitelisted as FiltersQuery).categories = categories as Category[]
    }
    if (typeof req.query.accessibilities === 'string') {
      const accessibilities = req.query.accessibilities
        .split(',')
        .map((item) => parseInt(item, 10))
      ;(whitelisted as FiltersQuery).accessibilities =
        accessibilities as Accessibility[]
    }

    const errors = await validate(whitelisted)
    req.query = whitelisted as { [key: string]: string }
    if (errors.length > 0) {
      res.status(400).send()
    } else {
      next()
    }
  }
}
