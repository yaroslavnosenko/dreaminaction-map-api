import { DataTypes, Model, Optional } from 'sequelize'
import { connection } from '../connection'

export interface FeatureAttributes {
  id: string
  name: string
}

export interface FeatureInput extends Optional<FeatureAttributes, 'id'> {}

export class Feature
  extends Model<FeatureAttributes, FeatureInput>
  implements FeatureAttributes
{
  id!: string
  name!: string
}

Feature.init(
  {
    id: { type: DataTypes.UUID, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
  },
  {
    timestamps: false,
    sequelize: connection,
    tableName: 'features',
  }
)

Feature.beforeCreate((entity) => {
  entity.id = crypto.randomUUID()
})
