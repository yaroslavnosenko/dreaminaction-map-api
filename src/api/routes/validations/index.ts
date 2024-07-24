import { Request } from 'express'
import { PlaceService } from '../../services'

export const isValidOwner = async (req: Request) => {
  const place = await PlaceService.getOne(req.params.id)
  return place?.userID === req.user?.id
}

export const isMe = async (req: Request) => {
  return req.params.id === req.user?.id
}