import { Request, Response } from 'express'

import { UserRequest, UserRoleRequest } from '../dtos'
import { UserService } from '../services'

export class UserController {
  public static async getUser(req: Request, res: Response) {
    const { id } = req.params
    const user = await UserService.getOne(id)
    user ? res.status(200).json(user) : res.status(404).send()
  }

  public static async getUsers(_: Request, res: Response) {
    const users = await UserService.getAll()
    res.status(200).json(users)
  }

  public static async createUser(req: Request, res: Response) {
    const { role, email } = req.body as UserRequest
    const user = await UserService.getOneByEmail(email)
    if (user) {
      return res.status(409).send()
    }
    const { id } = await UserService.create(email, role)
    res.status(201).json({ id })
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
