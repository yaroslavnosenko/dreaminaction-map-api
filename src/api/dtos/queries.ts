import { Expose } from 'class-transformer'
import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator'
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
