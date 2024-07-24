import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  ValidateNested,
} from 'class-validator'

import { Type } from 'class-transformer'
import { Accessibility, Category } from '../../consts'
import { QueryQuery } from './base'

export class PlaceDTO {
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

export class AccessibilityDTO {
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

// Queries

export class FiltersQuery extends QueryQuery {
  @IsArray()
  @IsEnum(Category, { each: true })
  @IsOptional()
  categories?: Category[]

  @IsArray()
  @IsEnum(Accessibility, { each: true })
  @IsOptional()
  accessibilities?: Accessibility[]
}

export class BoundsQuery extends FiltersQuery {
  @IsNumber()
  neLat: number
  @IsNumber()
  neLng: number
  @IsNumber()
  swLat: number
  @IsNumber()
  swLng: number
}
