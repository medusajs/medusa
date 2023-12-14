import "reflect-metadata"

import {
  FindManyOptions,
  FindOneOptions,
  FindOperator,
  FindOptionsSelect,
  FindOptionsWhere,
  OrderByCondition,
} from "typeorm"
import {
  IsDate,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from "class-validator"
import { Transform, Type } from "class-transformer"

import { BaseEntity } from "../interfaces"
import { ClassConstructor } from "./global"
import { FindOptionsOrder } from "typeorm/find-options/FindOptionsOrder"
import { FindOptionsRelations } from "typeorm/find-options/FindOptionsRelations"
import { transformDate } from "../utils/validators/date-transform"

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

type InnerSelector<TEntity> = {
  [key in keyof TEntity]?:
    | TEntity[key]
    | TEntity[key][]
    | DateComparisonOperator
    | StringComparisonOperator
    | NumericalComparisonOperator
    | FindOperator<TEntity[key][] | string | string[]>
}

export type Selector<TEntity> =
  | InnerSelector<TEntity>
  | InnerSelector<TEntity>[]

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

/**
 * @interface
 *
 * Request parameters used to configure and paginate retrieved data.
 */
export type RequestQueryFields = {
  /**
   * {@inheritDoc FindParams.expand}
   */
  expand?: string
  /**
   * {@inheritDoc FindParams.fields}
   */
  fields?: string
  /**
   * {@inheritDoc FindPaginationParams.offset}
   */
  offset?: number
  /**
   * {@inheritDoc FindPaginationParams.limit}
   */
  limit?: number
  /**
   * The field to sort the data by. By default, the sort order is ascending. To change the order to descending, prefix the field name with `-`.
   */
  order?: string
}

/**
 * @interface
 *
 * Pagination fields returned in the response of an API route.
 */
export type PaginatedResponse = {
  /**
   * The maximum number of items that can be returned in the list.
   */
  limit: number
  /**
   * The number of items skipped before the returned items in the list.
   */
  offset: number
  /**
   * The total number of items available.
   */
  count: number
}

/**
 * @interface
 *
 * The response returned for a DELETE request.
 */
export type DeleteResponse = {
  /**
   * The ID of the deleted item.
   */
  id: string
  /**
   * The type of the deleted item.
   */
  object: string
  /**
   * Whether the item was deleted successfully.
   */
  deleted: boolean
}

export class EmptyQueryParams {}

/**
 * Fields used to apply flexible filters on dates.
 */
export class DateComparisonOperator {
  /**
   * The filtered date must be less than this value.
   */
  @IsOptional()
  @IsDate()
  @Transform(transformDate)
  lt?: Date

  /**
   * The filtered date must be greater than this value.
   */
  @IsOptional()
  @IsDate()
  @Transform(transformDate)
  gt?: Date

  /**
   * The filtered date must be greater than or equal to this value.
   */
  @IsOptional()
  @IsDate()
  @Transform(transformDate)
  gte?: Date

  /**
   * The filtered date must be less than or equal to this value.
   */
  @IsOptional()
  @IsDate()
  @Transform(transformDate)
  lte?: Date
}

/**
 * Fields used to apply flexible filters on strings.
 */
export class StringComparisonOperator {
  /**
   * The filtered string must be less than this value.
   */
  @IsString()
  @IsOptional()
  lt?: string

  /**
   * The filtered string must be greater than this value.
   */
  @IsString()
  @IsOptional()
  gt?: string

  /**
   * The filtered string must be greater than or equal to this value.
   */
  @IsString()
  @IsOptional()
  gte?: string

  /**
   * The filtered string must be less than or equal to this value.
   */
  @IsString()
  @IsOptional()
  lte?: string

  /**
   * The filtered string must contain this value.
   */
  @IsString()
  @IsOptional()
  contains?: string

  /**
   * The filtered string must start with this value.
   */
  @IsString()
  @IsOptional()
  starts_with?: string

  /**
   * The filtered string must end with this value.
   */
  @IsString()
  @IsOptional()
  ends_with?: string
}

/**
 * Fields used to apply flexible filters on numbers.
 */
export class NumericalComparisonOperator {
  /**
   * The filtered number must be less than this value.
   */
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  lt?: number

  /**
   * The filtered number must be greater than this value.
   */
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  gt?: number

  /**
   * The filtered number must be greater than or equal to this value.
   */
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  gte?: number

  /**
   * The filtered number must be less than or equal to this value.
   */
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
 *     description: Company
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

/**
 * Parameters that can be used to configure how data is retrieved.
 */
export class FindParams {
  /**
   * Comma-separated relations that should be expanded in the returned data.
   */
  @IsString()
  @IsOptional()
  expand?: string

  /**
   * Comma-separated fields that should be included in the returned data.
   */
  @IsString()
  @IsOptional()
  fields?: string
}

/**
 * Parameters that can be used to configure how a list of data is paginated.
 */
export class FindPaginationParams {
  /**
   * The number of items to skip when retrieving a list.
   * @defaultValue 0
   */
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  offset?: number = 0

  /**
   * Limit the number of items returned in the list.
   * @defaultValue 20
   */
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
  /**
   * {@inheritDoc FindParams}
   */
  class FindExtendedPaginationParams extends FindParams {
    /**
     * {@inheritDoc FindPaginationParams.offset}
     * @defaultValue 0
     */
    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    offset?: number = offset ?? 0

    /**
     * {@inheritDoc FindPaginationParams.limit}
     * @defaultValue 20
     */
    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    limit?: number = limit ?? 20
  }

  return FindExtendedPaginationParams
}
