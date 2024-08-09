import { Request } from 'express'
import { Place } from '../../../database'

export const isValidOwner = async (req: Request) => {
  const place = await Place.findOneBy({ id: req.params.id })
  return place?.userId === req.user?.id
}

export const isMe = async (req: Request) => {
  return req.params.id === req.user?.id
}
