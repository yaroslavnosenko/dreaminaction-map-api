import { Request } from 'express'
import { Place } from '../../../database'

export const isValidOwner = async (req: Request) => {
  const place = await Place.findByPk(req.params.id)
  return place?.userID === req.user?.id
}

export const isMe = async (req: Request) => {
  return req.params.id === req.user?.id
}
