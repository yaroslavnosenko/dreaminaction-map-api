import { Column, Entity, OneToMany } from 'typeorm'
import { UserRole } from '../../consts'
import { Base } from './base'
import { Place } from './place'

@Entity()
export class User extends Base {
  @Column('varchar', { unique: true })
  email: string

  @Column('varchar')
  role: UserRole

  @OneToMany(() => Place, (place) => place.user)
  places: Place[]
}
