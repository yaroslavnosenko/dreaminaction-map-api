import { Request, Response } from 'express'

import { QueryQuery, UserRoleRequest } from '../dtos'
import { PlaceService, UserService } from '../services'

export class UserController {
  public static async getUser(req: Request, res: Response) {
    const { id } = req.params
    const user = await UserService.getOne(id)
    user ? res.status(200).json(user) : res.status(404).send()
  }

  public static async getUsers(req: Request, res: Response) {
    const query = req.query as QueryQuery
    const users = await UserService.getAll(query)
    res.status(200).json(users)
  }

  public static async getUserPlaces(req: Request, res: Response) {
    const { id } = req.params
    const places = await PlaceService.getByOwner(id)
    res.status(200).json(places)
  }

  public static async setRole(req: Request, res: Response) {
    const { id } = req.params
    const { role } = req.body as UserRoleRequest
    const result = await UserService.setRole(id, role)
    result ? res.status(200).json({ id }) : res.status(404).send()
  }

  public static async deleteUser(req: Request, res: Response) {
    const { id } = req.params
    await UserService.delete(id)
    res.status(200).send()
  }
}
