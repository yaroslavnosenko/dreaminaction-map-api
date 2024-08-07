import { DataTypes, Model } from 'sequelize'

import { connection } from '../connection'
import { Feature } from './feature'
import { Place } from './place'

export interface PlaceFeatureAttributes {
  available: boolean
  placeID: string
  featureID: string
}

export class PlaceFeature
  extends Model<PlaceFeatureAttributes, PlaceFeatureAttributes>
  implements PlaceFeatureAttributes
{
  placeID!: string
  featureID!: string
  available!: boolean
  Feature?: Feature
}

PlaceFeature.init(
  {
    placeID: { type: DataTypes.UUID, allowNull: false, primaryKey: true },
    featureID: { type: DataTypes.UUID, allowNull: false, primaryKey: true },
    available: { type: DataTypes.BOOLEAN, allowNull: false },
  },
  {
    timestamps: false,
    sequelize: connection,
    tableName: 'places_features',
  }
)

PlaceFeature.belongsTo(Place, { foreignKey: 'placeID' })
PlaceFeature.belongsTo(Feature, { foreignKey: 'featureID' })
