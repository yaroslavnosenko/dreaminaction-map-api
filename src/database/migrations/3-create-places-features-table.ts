import { DataTypes, QueryInterface } from 'sequelize'

export default {
  name: '3-create-places-features-table',

  up: async ({ context }: { context: QueryInterface }) => {
    await context.createTable('places_features', {
      featureID: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'features',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      placeID: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'places',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      available: { type: DataTypes.BOOLEAN, allowNull: false },
    })
  },

  down: async ({ context }: { context: QueryInterface }) => {
    await context.dropTable('places_features')
  },
}
