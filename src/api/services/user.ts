import { UserRole } from '../../consts'
import { ILike, User } from '../../database'
import { QueryQuery } from '../dtos'
import { UserRepsonse } from '../dtos/responses'

export class UserService {
  public static async create(email: string, role: UserRole): Promise<User> {
    return await User.create({ email, role }).save()
  }

  public static async getOne(id: string): Promise<UserRepsonse | null> {
    return await User.findOneBy({ id })
  }

  public static async getOneByEmail(
    email: string
  ): Promise<UserRepsonse | null> {
    return await User.findOneBy({ email })
  }

  public static async getAll(request: QueryQuery): Promise<UserRepsonse[]> {
    return request.query
      ? await User.find({
          where: [{ email: ILike(request.query) }],
          take: 30,
        })
      : await User.find({ take: 30 })
  }

  public static async setRole(id: string, role: UserRole): Promise<boolean> {
    const user = await User.findOneBy({ id })
    if (!user) return false
    user.role = role
    await user.save()
    return true
  }

  public static async delete(id: string): Promise<void> {
    await User.delete(id)
  }
}
