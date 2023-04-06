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
  FindOptionsSelect,
  FindOptionsWhere,
  OrderByCondition,
} from "typeorm"
import { FindOptionsOrder } from "typeorm/find-options/FindOptionsOrder"
import { FindOptionsRelations } from "typeorm/find-options/FindOptionsRelations"
import { BaseEntity } from "../interfaces"
import { transformDate } from "../utils/validators/date-transform"
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

export interface FindConfig<Entity> {
  select?: (keyof Entity)[]
  skip?: number
  take?: number
  relations?: string[]
  order?: { [K: string]: "ASC" | "DESC" }
}

export type ExtendedFindConfig<TEntity> = (
  | Omit<FindOneOptions<TEntity>, "where" | "relations" | "select">
  | Omit<FindManyOptions<TEntity>, "where" | "relations" | "select">
) & {
  select?: FindOptionsSelect<TEntity>
  relations?: FindOptionsRelations<TEntity>
  where: FindOptionsWhere<TEntity> | FindOptionsWhere<TEntity>[]
  order?: FindOptionsOrder<TEntity>
  skip?: number
  take?: number
}

export type QuerySelector<TEntity> = Selector<TEntity> & { q?: string }
export type TreeQuerySelector<TEntity> = QuerySelector<TEntity> & {
  include_descendants_tree?: boolean
}

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

/**
 * @schema AddressPayload
 * type: object
 * description: "Address fields used when creating/updating an address."
 * properties:
 *   first_name:
 *     description: First name
 *     type: string
 *     example: Arno
 *   last_name:
 *     description: Last name
 *     type: string
 *     example: Willms
 *   phone:
 *     type: string
 *     description: Phone Number
 *     example: 16128234334802
 *   company:
 *     type: string
 *   address_1:
 *     description: Address line 1
 *     type: string
 *     example: 14433 Kemmer Court
 *   address_2:
 *     description: Address line 2
 *     type: string
 *     example: Suite 369
 *   city:
 *     description: City
 *     type: string
 *     example: South Geoffreyview
 *   country_code:
 *     description: The 2 character ISO code of the country in lower case
 *     type: string
 *     externalDocs:
 *       url: https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2#Officially_assigned_code_elements
 *       description: See a list of codes.
 *     example: st
 *   province:
 *     description: Province
 *     type: string
 *     example: Kentucky
 *   postal_code:
 *     description: Postal Code
 *     type: string
 *     example: 72093
 *   metadata:
 *     type: object
 *     example: {car: "white"}
 *     description: An optional key-value map with additional details
 */
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

/**
 * @schema AddressCreatePayload
 * type: object
 * description: "Address fields used when creating an address."
 * required:
 *   - first_name
 *   - last_name
 *   - address_1
 *   - city
 *   - country_code
 *   - postal_code
 * properties:
 *   first_name:
 *     description: First name
 *     type: string
 *     example: Arno
 *   last_name:
 *     description: Last name
 *     type: string
 *     example: Willms
 *   phone:
 *     type: string
 *     description: Phone Number
 *     example: 16128234334802
 *   company:
 *     type: string
 *   address_1:
 *     description: Address line 1
 *     type: string
 *     example: 14433 Kemmer Court
 *   address_2:
 *     description: Address line 2
 *     type: string
 *     example: Suite 369
 *   city:
 *     description: City
 *     type: string
 *     example: South Geoffreyview
 *   country_code:
 *     description: The 2 character ISO code of the country in lower case
 *     type: string
 *     externalDocs:
 *       url: https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2#Officially_assigned_code_elements
 *       description: See a list of codes.
 *     example: st
 *   province:
 *     description: Province
 *     type: string
 *     example: Kentucky
 *   postal_code:
 *     description: Postal Code
 *     type: string
 *     example: 72093
 *   metadata:
 *     type: object
 *     example: {car: "white"}
 *     description: An optional key-value map with additional details
 */
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
