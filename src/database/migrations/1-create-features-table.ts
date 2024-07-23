import { DataTypes, QueryInterface } from 'sequelize'

export const up = async ({ context }: { context: QueryInterface }) => {
  await context.createTable('features', {
    id: { type: DataTypes.UUID, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
  })
}

export const down = async ({ context }: { context: QueryInterface }) => {
  await context.dropTable('features')
}
