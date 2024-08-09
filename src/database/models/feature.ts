import { Column, Entity } from 'typeorm'

import { Base } from './base'

@Entity()
export class Feature extends Base {
  @Column('varchar')
  name: string
}
