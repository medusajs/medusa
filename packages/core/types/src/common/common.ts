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

/**
 * Utility type used to remove some optional attributes (coming from K) from a type T
 */
export type WithRequiredProperty<T, K extends keyof T> = T & {
  [Property in K]-?: T[Property]
}

/**
 * @ignore
 */
export type PartialPick<T, K extends keyof T> = {
  [P in K]?: T[P]
}

/**
 * Representing a table in the database.
 */
export interface BaseEntity {
  /**
   * The ID of an entity's record.
   */
  id: string

  /**
   * The date an entity's record was created.
   */
  created_at: Date

  /**
   * The date an entity's record was updated.
   */
  updated_at: Date
}

/**
 * Representing a deletable entity.
 */
export interface SoftDeletableEntity extends BaseEntity {
  /**
   * The date an entity's record was deleted.
   */
  deleted_at: Date | null
}

/**
 * @ignore
 */
export type Writable<T> = {
  -readonly [key in keyof T]:
    | T[key]
    | FindOperator<T[key]>
    | FindOperator<T[key][]>
    | FindOperator<string[]>
}

/**
 * @interface
 *
 * An object that is used to configure how an entity is retrieved from the database. It accepts as a typed parameter an `Entity` class,
 * which provides correct typing of field names in its properties.
 */
export interface FindConfig<Entity> {
  /**
   * An array of strings, each being attribute names of the entity to retrieve in the result.
   */
  select?: (keyof Entity | string)[]

  /**
   * A number indicating the number of records to skip before retrieving the results.
   */
  skip?: number | null | undefined

  /**
   * A number indicating the number of records to return in the result.
   */
  take?: number | null | undefined

  /**
   * An array of strings, each being relation names of the entity to retrieve in the result.
   */
  relations?: string[]

  /**
   * An object used to specify how to sort the returned records. Its keys are the names of attributes of the entity, and a key's value can either be `ASC`
   * to sort retrieved records in an ascending order, or `DESC` to sort retrieved records in a descending order.
   */
  order?: {
    [K: string]: "ASC" | "DESC"
  }

  /**
   * A boolean indicating whether deleted records should also be retrieved as part of the result. This only works if the entity extends the
   * `SoftDeletableEntity` class.
   */
  withDeleted?: boolean

  /**
   * Enable ORM specific defined filters
   */
  filters?: Record<string, any>

  /**
   * Enable ORM specific defined options
   */
  options?: Record<string, any>
}

/**
 * @ignore
 */
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

/**
 * @ignore
 */
export type QuerySelector<TEntity> = Selector<TEntity> & {
  q?: string
}

/**
 * @ignore
 */
export type TreeQuerySelector<TEntity> = QuerySelector<TEntity> & {
  include_descendants_tree?: boolean
}

/**
 * @ignore
 */
export type Selector<TEntity> = {
  [key in keyof TEntity]?:
    | TEntity[key]
    | TEntity[key][]
    | DateComparisonOperator
    | StringComparisonOperator
    | NumericalComparisonOperator
    | FindOperator<TEntity[key][] | string | string[]>
}

/**
 * @ignore
 */
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

/**
 * @ignore
 */
export interface CustomFindOptions<TModel, InKeys extends keyof TModel> {
  select?: FindManyOptions<TModel>["select"]
  where?: FindManyOptions<TModel>["where"] & {
    [P in InKeys]?: TModel[P][]
  }
  order?: OrderByCondition
  skip?: number
  take?: number
}

/**
 * @ignore
 */
export type QueryConfig<TEntity extends BaseEntity> = {
  deafults?: (keyof TEntity | string)[]
  allowed?: (keyof TEntity | string)[]
  defaultLimit?: number
  isList?: boolean
}

/**
 * @interface
 *
 * Fields that can be passed in the query parameters of a request.
 */
export type RequestQueryFields = {
  /**
   * Comma-separated relations that should be expanded in the returned data.
   * @deprecated Use `fields` instead and the relations will be inferred
   */
  expand?: string

  /**
   * Comma-separated fields that should be included in the returned data.
   * if a field is prefixed with `+` it will be added to the default fields, using `-` will remove it from the default fields.
   * without prefix it will replace the entire default fields.
   */
  fields?: string

  /**
   * The number of items to skip when retrieving a list.
   */
  offset?: number

  /**
   * Limit the number of items returned in the list.
   */
  limit?: number

  /**
   * The field to sort the data by. By default, the sort order is ascending. To change the order to descending, prefix the field name with `-`.
   */
  order?: string
}

/**
 * Requests that don't accept any query parameters can use this type.
 */
export interface EmptyQueryParams {}

// TODO: Build a tree repository options from this
export interface RepositoryTransformOptions {}

/**
 * Fields used to apply flexible filters on dates.
 */
export interface DateComparisonOperator {
  /**
   * The filtered date must be less than this value.
   */
  lt?: Date

  /**
   * The filtered date must be greater than this value.
   */
  gt?: Date

  /**
   * The filtered date must be greater than or equal to this value.
   */
  gte?: Date

  /**
   * The filtered date must be less than or equal to this value.
   */
  lte?: Date
}

/**
 * Fields used to apply flexible filters on strings.
 */
export interface StringComparisonOperator {
  /**
   * The filtered string must be less than this value.
   */
  lt?: string

  /**
   * The filtered string must be greater than this value.
   */
  gt?: string

  /**
   * The filtered string must be greater than or equal to this value.
   */
  gte?: string

  /**
   * The filtered string must be less than or equal to this value.
   */
  lte?: string

  /**
   * The filtered string must contain this value.
   */
  contains?: string

  /**
   * The filtered string must start with this value.
   */
  starts_with?: string

  /**
   * The filtered string must end with this value.
   */
  ends_with?: string
}

/**
 * Fields used to apply flexible filters on numbers.
 */
export interface NumericalComparisonOperator {
  /**
   * The filtered number must be less than this value.
   */
  lt?: number

  /**
   * The filtered number must be greater than this value.
   */
  gt?: number

  /**
   * The filtered number must be greater than or equal to this value.
   */
  gte?: number

  /**
   * The filtered number must be less than or equal to this value.
   */
  lte?: number
}

/**
 * @ignore
 */
export type Pluralize<Singular extends string> = Singular extends `${infer R}ey`
  ? `${R}eys`
  : Singular extends `${infer R}y`
  ? `${R}ies`
  : Singular extends `${infer R}es`
  ? `${Singular}`
  : Singular extends
      | `${infer R}ss`
      | `${infer R}sh`
      | `${infer R}ch`
      | `${infer R}x`
      | `${infer R}z`
      | `${infer R}o`
  ? `${Singular}es`
  : `${Singular}s`

export type SnakeCase<S extends string> =
  S extends `${infer T}${infer U}${infer V}`
    ? U extends Uppercase<U>
      ? `${Lowercase<T>}_${SnakeCase<`${Lowercase<U>}${V}`>}`
      : `${T}${SnakeCase<`${U}${V}`>}`
    : S

export type KebabCase<S extends string> =
  S extends `${infer T}${infer U}${infer V}`
    ? U extends Uppercase<U>
      ? `${Lowercase<T>}-${KebabCase<`${Lowercase<U>}${V}`>}`
      : `${T}${KebabCase<`${U}${V}`>}`
    : S

export type MetadataType = Record<string, unknown> | null

export type RawRounding = {
  value: string
  precision: number
}
