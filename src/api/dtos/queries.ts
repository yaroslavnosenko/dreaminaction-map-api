import { Expose, Type } from 'class-transformer'
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
  @Expose()
  query?: string
}

export class FiltersQuery extends QueryQuery {
  @IsArray()
  @IsEnum(Category, { each: true })
  @IsOptional()
  @Expose()
  categories?: Category[]

  @IsArray()
  @IsEnum(Accessibility, { each: true })
  @IsOptional()
  @Expose()
  accessibilities?: Accessibility[]
}

export class BoundsQuery extends FiltersQuery {
  @IsNumber()
  @Expose()
  @Type(() => Number)
  neLat: number
  @IsNumber()
  @Expose()
  @Type(() => Number)
  neLng: number
  @IsNumber()
  @Expose()
  @Type(() => Number)
  swLat: number
  @IsNumber()
  @Expose()
  @Type(() => Number)
  swLng: number
}
