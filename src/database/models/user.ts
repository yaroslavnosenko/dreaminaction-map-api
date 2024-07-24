import { DataTypes, Model, Optional } from 'sequelize'

import { UserRole } from '../../consts'
import { connection } from '../connection'

export interface UserAttributes {
  id: string
  email: string
  role: UserRole
  firstName: string
  lastName: string
}

export interface UserInput
  extends Optional<UserAttributes, 'id' | 'firstName' | 'lastName'> {}

export class User
  extends Model<UserAttributes, UserInput>
  implements UserAttributes
{
  id!: string
  email!: string
  role!: UserRole
  firstName!: string
  lastName!: string
}

User.init(
  {
    id: { type: DataTypes.UUID, primaryKey: true },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    role: { type: DataTypes.STRING, allowNull: false },
    firstName: { type: DataTypes.STRING },
    lastName: { type: DataTypes.STRING },
  },
  {
    timestamps: false,
    sequelize: connection,
    tableName: 'users',
  }
)

User.beforeCreate((entity) => {
  entity.id = crypto.randomUUID()
})
