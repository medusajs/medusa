import { FindManyOptions, FindOneOptions, FindOperator } from "typeorm"
import { IsNumber, IsOptional, IsString } from "class-validator"
import { Type } from "class-transformer"

export type ExtendedFindConfig<
  TEntity,
  TWhereKeys = TEntity
> = FindConfig<TEntity> &
  (FindOneOptions<TEntity> | FindManyOptions<TEntity>) & {
    where: Partial<Writable<TWhereKeys>>
    withDeleted?: boolean
    relations?: string[]
  }

export type Selector<TEntity> = {
  [key in keyof TEntity]?:
    | TEntity[key]
    | TEntity[key][]
    | StringComparisonOperator
    | NumericalComparisonOperator
    | FindOperator<TEntity[key][] | string[]>
}

export interface FindConfig<Entity> {
  select?: (keyof Entity)[]
  skip?: number
  take?: number
  relations?: string[]
  order?: Record<string, "ASC" | "DESC">
}

export class NumericalComparisonOperator {
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  lt?: number

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  gt?: number

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  gte?: number

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  lte?: number
}

export class StringComparisonOperator {
  @IsString()
  @IsOptional()
  lt?: string

  @IsString()
  @IsOptional()
  gt?: string

  @IsString()
  @IsOptional()
  gte?: string

  @IsString()
  @IsOptional()
  lte?: string
}

export type Writable<T> = {
  -readonly [key in keyof T]:
    | T[key]
    | FindOperator<T[key][]>
    | FindOperator<string[]>
}
