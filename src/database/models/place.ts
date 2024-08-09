import { Column, Entity, ManyToOne, OneToMany } from 'typeorm'
import { Accessibility, Category } from '../../consts'
import { Base } from './base'
import { PlaceFeature } from './placeFeature'
import { User } from './user'

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

  @ManyToOne(() => User, (user) => user.places, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user: Promise<User>
  @Column('varchar', { nullable: false })
  userId: string

  @OneToMany(() => PlaceFeature, (placeFeature) => placeFeature.place)
  placeFeature: PlaceFeature[]
}
