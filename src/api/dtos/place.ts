import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator'

import { Accessibility, Category } from '../../consts'

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

export class OwnerDTO {
  @IsUUID()
  owner: string
}

export class PlaceFeaturesDTO {
  @IsNumber()
  neLat: number
  @IsNumber()
  neLng: number
  @IsNumber()
  swLat: number
  @IsNumber()
  swLng: number
}

export class BoundsParams {
  @IsNumber()
  neLat: number
  @IsNumber()
  neLng: number
  @IsNumber()
  swLat: number
  @IsNumber()
  swLng: number
}
