import { IsEnum, IsString, IsUUID } from 'class-validator'

export class IdParams {
  @IsUUID()
  id: string
}

export class TokenDTO {
  @IsEnum(['google', 'facebook'])
  provider: 'google' | 'facebook'

  @IsString()
  token: string
}
