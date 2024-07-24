import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator'

import { Type } from 'class-transformer'
import { Accessibility, Category, UserRole } from '../../consts'

export class TokenRequest {
  @IsEnum(['google', 'facebook'])
  provider: 'google' | 'facebook'

  @IsString()
  token: string
}

export class UserRoleRequest {
  @IsEnum(UserRole)
  role: UserRole
}

export class FeatureRequest {
  @IsString()
  @MinLength(3)
  @MaxLength(120)
  name: string
}

export class PlaceRequest {
  @IsString()
  @MaxLength(120)
  name: string

  @IsEnum(Category)
  category: Category

  @IsString()
  @MaxLength(120)
  address: string

  @IsNumber()
  lat: number

  @IsNumber()
  lng: number

  @IsString()
  @MaxLength(180)
  @IsOptional()
  description?: string
}

export class AccessibilityRequest {
  @IsEnum(Accessibility)
  accessibility: Accessibility
}

// Places - Features

class FeatureMapping {
  @IsUUID()
  id: string

  @IsBoolean()
  available: boolean
}

export class FeaturesRequest {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FeatureMapping)
  features: FeatureMapping[]
}
