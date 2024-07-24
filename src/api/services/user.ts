import { UserRole } from '../../consts'
import { User } from '../../database'

export class UserService {
  public static async create(
    email: string,
    role: UserRole,
    firstName?: string,
    lastName?: string
  ): Promise<User> {
    return User.create({ email, role, firstName, lastName })
  }

  public static async getOne(id: string): Promise<User | null> {
    return User.findOne({ where: { id } })
  }

  public static async getOneByEmail(email: string): Promise<User | null> {
    return User.findOne({ where: { email } })
  }

  public static async getAll(query: string = ''): Promise<User[]> {
    return User.findAll()
  }

  public static async setRole(id: string, role: UserRole): Promise<string> {
    const [count] = await User.update({ role }, { where: { id } })
    if (count !== 1) throw new Error('NOT_FOUND')
    return id
  }

  public static async delete(id: string): Promise<void> {
    await User.destroy({ where: { id } })
  }
}
