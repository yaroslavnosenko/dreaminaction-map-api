import { UserRole } from '../../consts'
import { User } from '../../database'
import { UserRepsonse } from '../dtos'

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

  public static async getAll(): Promise<UserRepsonse[]> {
    return await User.find({ order: { updatedAt: 'DESC' } })
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
