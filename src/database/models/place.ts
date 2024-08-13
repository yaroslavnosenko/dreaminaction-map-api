import { Column, Entity, OneToMany } from 'typeorm'
import { Accessibility, Category } from '../../consts'
import { Base } from './base'
import { PlaceFeature } from './placeFeature'

@Entity()
export class Place extends Base {
  @Column('varchar')
  name: string

  @Column('varchar')
  address: string

  @Column('varchar')
  category: Category

  @Column('int')
  accessibility: Accessibility

  @Column('float')
  lat: number

  @Column('float')
  lng: number

  @Column('varchar', { nullable: true })
  description: string

  @OneToMany(() => PlaceFeature, (placeFeature) => placeFeature.place)
  placeFeature: PlaceFeature[]
}
