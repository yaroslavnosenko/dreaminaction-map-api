import { Column, Entity, ManyToOne } from 'typeorm'
import { Base } from './base'
import { Feature } from './feature'
import { Place } from './place'

@Entity()
export class PlaceFeature extends Base {
  @ManyToOne(() => Place, {
    nullable: false,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  place: Place
  @Column('varchar', { primary: true })
  placeId: string

  @ManyToOne(() => Feature, {
    nullable: false,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  feature: Feature
  @Column('varchar', { primary: true })
  featureId: string

  @Column('boolean')
  available: boolean
}
