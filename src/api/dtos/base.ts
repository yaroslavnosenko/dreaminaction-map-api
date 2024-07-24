import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator'

export class IdProp {
  @IsUUID()
  id: string
}

export class TokenDTO {
  @IsEnum(['google', 'facebook'])
  provider: 'google' | 'facebook'

  @IsString()
  token: string
}

export class QueryQuery {
  @IsString()
  @IsOptional()
  query?: string
}
