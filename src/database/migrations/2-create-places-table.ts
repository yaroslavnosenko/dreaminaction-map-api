import { DataTypes, QueryInterface } from 'sequelize'

export default {
  name: '2-create-places-table',

  up: async ({ context }: { context: QueryInterface }) => {
    await context.createTable('places', {
      id: { type: DataTypes.UUID, primaryKey: true },
      name: { type: DataTypes.STRING, allowNull: false },
      category: { type: DataTypes.STRING, allowNull: false },
      accessibility: { type: DataTypes.INTEGER, allowNull: false },
      lat: { type: DataTypes.DOUBLE, allowNull: false },
      lng: { type: DataTypes.DOUBLE, allowNull: false },
      description: { type: DataTypes.STRING },
      userID: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
    })
  },

  down: async ({ context }: { context: QueryInterface }) => {
    await context.dropTable('places')
  },
}
