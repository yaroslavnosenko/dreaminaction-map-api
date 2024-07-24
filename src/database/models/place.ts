import { DataTypes, Model, Optional } from 'sequelize'

import { Accessibility, Category } from '../../consts'
import { connection } from '../connection'
import { User } from './'

export interface PlaceAttributes {
  id: string
  name: string
  category: Category
  accessibility: Accessibility
  lat: number
  lng: number
  description: string
  userID: string
}

export interface PlaceInput
  extends Optional<PlaceAttributes, 'id' | 'description'> {}

export class Place
  extends Model<PlaceAttributes, PlaceInput>
  implements PlaceAttributes
{
  id!: string
  name!: string
  category!: Category
  accessibility!: Accessibility
  lat!: number
  lng!: number
  description!: string
  userID!: string
}

Place.init(
  {
    id: { type: DataTypes.UUID, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    category: { type: DataTypes.STRING, allowNull: false },
    accessibility: { type: DataTypes.INTEGER, allowNull: false },
    lat: { type: DataTypes.DOUBLE, allowNull: false },
    lng: { type: DataTypes.DOUBLE, allowNull: false },
    description: { type: DataTypes.STRING },
    userID: { type: DataTypes.UUID, allowNull: false },
  },
  {
    timestamps: false,
    sequelize: connection,
    tableName: 'places',
  }
)

Place.beforeCreate((entity) => {
  entity.id = crypto.randomUUID()
})

Place.belongsTo(User, { foreignKey: 'userID' })
