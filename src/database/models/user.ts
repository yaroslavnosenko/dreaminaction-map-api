import { DataTypes, Model, Optional } from 'sequelize'
import { connection } from '../connection'

export enum UserRole {
  user = 'user',
  manager = 'manager',
  admin = 'admin',
}

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
    email: { type: DataTypes.STRING, allowNull: false },
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
