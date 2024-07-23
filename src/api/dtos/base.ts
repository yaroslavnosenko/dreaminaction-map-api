import { IsEnum, IsString, IsUUID } from 'class-validator'

export class IdDTO {
  @IsUUID()
  id: string
}

export class TokenDTO {
  @IsEnum(['google', 'facebook'])
  provider: 'google' | 'facebook'

  @IsString()
  token: string
}
