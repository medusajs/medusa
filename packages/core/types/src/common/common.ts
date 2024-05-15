import { FindOperator } from "typeorm"

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
 * @interface
 *
 * Fields included in the response if it's paginated.
 */
export type PaginatedResponse<T = unknown> = {
  /**
   * The limit applied on the retrieved items.
   */
  limit: number

  /**
   * The number of items skipped before retrieving the list of items.
   */
  offset: number

  /**
   * The total count of items.
   */
  count: number
} & T

/**
 * The fields returned in the response of a DELETE request.
 */
export type DeleteResponse<T = string> = {
  /**
   * The ID of the item that was deleted.
   */
  id: string

  /**
   * The type of the item that was deleted.
   */
  object: T

  /**
   * Whether the item was deleted successfully.
   */
  deleted: boolean
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
 * Address fields used when creating/updating an address.
 */
export interface AddressPayload {
  /**
   * First name
   */
  first_name?: string

  /**
   * Last name
   */
  last_name?: string

  /**
   * Phone Number
   */
  phone?: string

  /**
   * Holds custom data in key-value pairs.
   */
  metadata?: Record<string, unknown>

  /**
   * Company
   */
  company?: string

  /**
   * Address line 1
   */
  address_1?: string

  /**
   * Address line 2
   */
  address_2?: string

  /**
   * City
   */
  city?: string

  /**
   * The 2 character ISO code of the country in lower case
   */
  country_code?: string

  /**
   * Province
   */
  province?: string

  /**
   * Postal Code
   */
  postal_code?: string
}

/**
 * Address fields used when creating an address.
 */
export interface AddressCreatePayload {
  /**
   * First name
   */
  first_name: string

  /**
   * Last name
   */
  last_name: string

  /**
   * Phone Number
   */
  phone: string

  /**
   * Holds custom data in key-value pairs.
   */
  metadata: object

  /**
   * Company
   */
  company: string

  /**
   * Address line 1
   */
  address_1: string

  /**
   * Address line 2
   */
  address_2: string

  /**
   * City
   */
  city: string

  /**
   * The 2 character ISO code of the country in lower case
   */
  country_code: string

  /**
   * Province
   */
  province: string

  /**
   * Postal Code
   */
  postal_code: string
}

/**
 * Parameters that can be used to configure how data is retrieved.
 */
export interface FindParams {
  /**
   * Comma-separated relations that should be expanded in the returned data.
   */
  expand?: string

  /**
   *Comma-separated fields that should be included in the returned data.
   */
  fields?: string
}

/**
 * Parameters that can be used to configure how a list of data is paginated.
 */
export interface FindPaginationParams {
  /**
   * The number of items to skip when retrieving a list.
   */
  offset?: number

  /**
   * Limit the number of items returned in the list.
   */
  limit?: number
}

/**
 * @ignore
 */
export type Pluralize<Singular extends string> = Singular extends `${infer R}y`
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
