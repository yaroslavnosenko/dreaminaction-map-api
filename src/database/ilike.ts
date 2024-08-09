import { Raw } from 'typeorm'

export const ILike = (pattern: string) =>
  Raw((alias) => `LOWER(${alias}) LIKE '%${pattern.toLowerCase()}%'`)
