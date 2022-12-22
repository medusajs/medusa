import { Transform, Type } from "class-transformer"
import {
  IsDate,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from "class-validator"
import "reflect-metadata"
import {
  FindManyOptions,
  FindOneOptions,
  FindOperator,
  OrderByCondition,
} from "typeorm"
import { transformDate } from "../utils/validators/date-transform"
import { BaseEntity } from "../interfaces"
import { ClassConstructor } from "./global"

/**
 * Utility type used to remove some optional attributes (coming from K) from a type T
 */
export type WithRequiredProperty<T, K extends keyof T> = T & {
  // -? removes 'optional' from a property
  [Property in K]-?: T[Property]
}

export type PartialPick<T, K extends keyof T> = {
  [P in K]?: T[P]
}

export type Writable<T> = {
  -readonly [key in keyof T]:
    | T[key]
    | FindOperator<T[key]>
    | FindOperator<T[key][]>
    | FindOperator<string[]>
}

export type ExtendedFindConfig<
  TEntity,
  TWhereKeys = TEntity
> = FindConfig<TEntity> &
  (FindOneOptions<TEntity> | FindManyOptions<TEntity>) & {
    where: Partial<Writable<TWhereKeys>>
    withDeleted?: boolean
    relations?: string[]
  }

export type QuerySelector<TEntity> = Selector<TEntity> & { q?: string }

export type Selector<TEntity> = {
  [key in keyof TEntity]?:
    | TEntity[key]
    | TEntity[key][]
    | DateComparisonOperator
    | StringComparisonOperator
    | NumericalComparisonOperator
    | FindOperator<TEntity[key][] | string | string[]>
}

export type TotalField =
  | "shipping_total"
  | "discount_total"
  | "tax_total"
  | "refunded_total"
  | "total"
  | "subtotal"
  | "refundable_amount"
  | "gift_card_total"
  | "gift_card_tax_total"

export interface FindConfig<Entity> {
  select?: (keyof Entity)[]
  skip?: number
  take?: number
  relations?: string[]
  order?: Record<string, "ASC" | "DESC">
}

export interface CustomFindOptions<TModel, InKeys extends keyof TModel> {
  select?: FindManyOptions<TModel>["select"]
  where?: FindManyOptions<TModel>["where"] & {
    [P in InKeys]?: TModel[P][]
  }
  order?: OrderByCondition
  skip?: number
  take?: number
}

export type QueryConfig<TEntity extends BaseEntity> = {
  defaultFields?: (keyof TEntity | string)[]
  defaultRelations?: string[]
  allowedFields?: string[]
  allowedRelations?: string[]
  defaultLimit?: number
  isList?: boolean
}

export type RequestQueryFields = {
  expand?: string
  fields?: string
  offset?: number
  limit?: number
  order?: string
}

export type PaginatedResponse = { limit: number; offset: number; count: number }

export type DeleteResponse = {
  id: string
  object: string
  deleted: boolean
}

export class EmptyQueryParams {}

export class DateComparisonOperator {
  @IsOptional()
  @IsDate()
  @Transform(transformDate)
  lt?: Date

  @IsOptional()
  @IsDate()
  @Transform(transformDate)
  gt?: Date

  @IsOptional()
  @IsDate()
  @Transform(transformDate)
  gte?: Date

  @IsOptional()
  @IsDate()
  @Transform(transformDate)
  lte?: Date
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

export class AddressPayload {
  @IsOptional()
  @IsString()
  first_name?: string

  @IsOptional()
  @IsString()
  last_name?: string

  @IsOptional()
  @IsString()
  phone?: string

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>

  @IsOptional()
  @IsString()
  company?: string

  @IsOptional()
  @IsString()
  address_1?: string

  @IsOptional()
  @IsString()
  address_2?: string

  @IsOptional()
  @IsString()
  city?: string

  @IsOptional()
  @IsString()
  country_code?: string

  @IsOptional()
  @IsString()
  province?: string

  @IsOptional()
  @IsString()
  postal_code?: string
}

export class AddressCreatePayload {
  @IsString()
  first_name: string

  @IsString()
  last_name: string

  @IsOptional()
  @IsString()
  phone: string

  @IsOptional()
  metadata: object

  @IsOptional()
  @IsString()
  company: string

  @IsString()
  address_1: string

  @IsOptional()
  @IsString()
  address_2: string

  @IsString()
  city: string

  @IsString()
  country_code: string

  @IsOptional()
  @IsString()
  province: string

  @IsString()
  postal_code: string
}

export class FindParams {
  @IsString()
  @IsOptional()
  expand?: string

  @IsString()
  @IsOptional()
  fields?: string
}

export class FindPaginationParams {
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  offset?: number = 0

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  limit?: number = 20
}

export function extendedFindParamsMixin({
  limit,
  offset,
}: {
  limit?: number
  offset?: number
} = {}): ClassConstructor<FindParams & FindPaginationParams> {
  class FindExtendedPaginationParams extends FindParams {
    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    offset?: number = offset ?? 0

    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    limit?: number = limit ?? 20
  }

  return FindExtendedPaginationParams
}
