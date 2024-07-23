import { IsString, MaxLength, MinLength } from 'class-validator'

export class FeatureDTO {
  @IsString()
  @MinLength(3)
  @MaxLength(120)
  name: string
}
