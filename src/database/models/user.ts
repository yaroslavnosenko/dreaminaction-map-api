import { Column, Entity } from 'typeorm'
import { UserRole } from '../../consts'
import { Base } from './base'

@Entity()
export class User extends Base {
  @Column('varchar', { unique: true })
  email: string

  @Column('varchar')
  role: UserRole
}
