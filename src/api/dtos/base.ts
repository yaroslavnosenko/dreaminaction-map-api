import { IsUUID } from 'class-validator'

export class IdProp {
  @IsUUID()
  id: string
}
