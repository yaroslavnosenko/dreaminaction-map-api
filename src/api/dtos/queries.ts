import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator'
import { Accessibility, Category } from '../../consts'

export class QueryQuery {
  @IsString()
  @IsOptional()
  query?: string
}

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
