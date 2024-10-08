import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator'

import { Expose, Type } from 'class-transformer'
import { Accessibility, Category, UserRole } from '../../consts'

export class SendOtpRequest {
  @IsEmail()
  @Expose()
  email: string
}

export class ValidateOtpRequest {
  @IsEmail()
  @Expose()
  email: string

  @IsString()
  @Expose()
  @Length(6)
  otp: string
}

export class UserRoleRequest {
  @IsEnum(UserRole)
  @Expose()
  role: UserRole
}

export class UserRequest extends UserRoleRequest {
  @IsEmail()
  @Expose()
  email: string
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

  @IsEnum(Accessibility)
  @Expose()
  accessibility: Accessibility

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
