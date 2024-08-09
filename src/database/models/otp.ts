import { Column, Entity } from 'typeorm'
import { Base } from './base'

@Entity()
export class Otp extends Base {
  @Column('varchar', { unique: true })
  email: string

  @Column('varchar')
  otp: string
}
