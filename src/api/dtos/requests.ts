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

import { Expose, Type } from 'class-transformer'
import { Accessibility, Category, UserRole } from '../../consts'

export class TokenRequest {
  @IsEnum(['google', 'facebook'])
  @Expose()
  provider: 'google' | 'facebook'

  @IsString()
  @Expose()
  token: string
}

export class UserRoleRequest {
  @IsEnum(UserRole)
  @Expose()
  role: UserRole
}

export class FeatureRequest {
  @IsString()
  @MinLength(3)
  @MaxLength(120)
  @Expose()
  name: string
}

export class PlaceRequest {
  @IsString()
  @MaxLength(120)
  @Expose()
  name: string

  @IsEnum(Category)
  @Expose()
  category: Category

  @IsString()
  @MaxLength(120)
  @Expose()
  address: string

  @IsNumber()
  @Expose()
  lat: number

  @IsNumber()
  @Expose()
  lng: number

  @IsString()
  @MaxLength(180)
  @IsOptional()
  @Expose()
  description?: string
}

export class AccessibilityRequest {
  @IsEnum(Accessibility)
  @Expose()
  accessibility: Accessibility
}

// Places - Features

class FeatureMapping {
  @IsUUID()
  @Expose()
  id: string

  @IsBoolean()
  @Expose()
  available: boolean
}

export class FeaturesRequest {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FeatureMapping)
  @Expose()
  features: FeatureMapping[]
}
