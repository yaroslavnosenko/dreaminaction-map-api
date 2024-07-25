import { Expose } from 'class-transformer'
import { IsUUID } from 'class-validator'

export class IdProp {
  @IsUUID()
  @Expose()
  id: string
}
