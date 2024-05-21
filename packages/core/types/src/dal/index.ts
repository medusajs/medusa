import { Dictionary, FilterQuery, Order } from "./utils"

export { FilterQuery, OperatorMap } from "./utils"

/**
 * @interface
 *
 * An object used to allow specifying flexible queries with and/or conditions.
 */
export interface BaseFilterable<T> {
  /**
   * An array of filters to apply on the entity, where each item in the array is joined with an "and" condition.
   */
  $and?: (T | BaseFilterable<T>)[]

  /**
   * An array of filters to apply on the entity, where each item in the array is joined with an "or" condition.
   */
  $or?: (T | BaseFilterable<T>)[]
}

/**
 * The options to apply when retrieving an item.
 */
export interface OptionsQuery<T, P extends string = never> {
  /**
   * Relations to populate in the retrieved items.
   */
  populate?: string[]
  /**
   * Fields to sort-order items by.
   */
  orderBy?: Order<T> | Order<T>[]
  /**
   * Limit the number of items retrieved in the list.
   */
  limit?: number
  /**
   * The number of items to skip before the retrieved items in the list.
   */
  offset?: number
  /**
   * The fields to include in each of the items.
   */
  fields?: string[]
  /**
   * Group results by a field or set of fields.
   */
  groupBy?: string | string[]
  /**
   * Filters to apply on the retrieved items.
   */
  filters?: Dictionary<boolean | Dictionary> | string[] | boolean
}

/**
 * @interface
 *
 * An object used to specify filters and options on a list of items.
 */
export type FindOptions<T = any> = {
  /**
   * The filters to apply on the items.
   */
  where: FilterQuery<T> & BaseFilterable<FilterQuery<T>>

  /**
   * The options to apply when retrieving the items.
   */
  options?: OptionsQuery<T, any>
}

/**
 * @interface
 *
 * An object used to specify the configuration of how the upsert should be performed.
 */
export type UpsertWithReplaceConfig<T> = {
  /**
   * The relationships that will be updated/created/deleted as part of the upsert
   */
  relations?: (keyof T)[]
}

export * from "./repository-service"
export * from "./entity"
