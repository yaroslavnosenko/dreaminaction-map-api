import { DataTypes, QueryInterface } from 'sequelize'

export default {
  name: '0-create-users-table',

  up: async ({ context }: { context: QueryInterface }) => {
    await context.createTable('users', {
      id: { type: DataTypes.UUID, primaryKey: true },
      email: { type: DataTypes.STRING, allowNull: false, unique: true },
      role: { type: DataTypes.STRING, allowNull: false },
      firstName: { type: DataTypes.STRING },
      lastName: { type: DataTypes.STRING },
    })
  },

  down: async ({ context }: { context: QueryInterface }) => {
    await context.dropTable('users')
  },
}
