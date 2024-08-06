import { Op } from 'sequelize'

import { UserRole } from '../../consts'
import { User } from '../../database'
import { QueryQuery } from '../dtos'
import { UserRepsonse } from '../dtos/responses'

export class UserService {
  public static async create(
    email: string,
    role: UserRole,
    firstName?: string,
    lastName?: string
  ): Promise<User> {
    return User.create({ email, role, firstName, lastName })
  }

  public static async getOne(id: string): Promise<UserRepsonse | null> {
    return User.findOne({ where: { id } })
  }

  public static async getOneByEmail(
    email: string
  ): Promise<UserRepsonse | null> {
    return User.findOne({ where: { email } })
  }

  public static async getAll(request: QueryQuery): Promise<UserRepsonse[]> {
    const query = request.query ? `%${request.query}%` : false
    if (!query) {
      return await User.findAll({ limit: 30 })
    }
    const operator = { [Op.like]: query }
    return User.findAll({
      limit: 100,
      where: {
        [Op.or]: [
          { email: operator },
          { firstName: operator },
          { lastName: operator },
        ],
      },
    })
  }

  public static async setRole(id: string, role: UserRole): Promise<boolean> {
    const [count] = await User.update({ role }, { where: { id } })
    return count === 1
  }

  public static async delete(id: string): Promise<void> {
    await User.destroy({ where: { id } })
  }
}
