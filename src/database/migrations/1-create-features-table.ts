import { DataTypes, QueryInterface } from 'sequelize'

export default {
  name: '1-create-features-table',

  up: async ({ context }: { context: QueryInterface }) => {
    await context.createTable('features', {
      id: { type: DataTypes.UUID, primaryKey: true },
      name: { type: DataTypes.STRING, allowNull: false },
    })
  },

  down: async ({ context }: { context: QueryInterface }) => {
    await context.dropTable('features')
  },
}
