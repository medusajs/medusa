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

export type QueryConfig<TEntity> = {
  /**
   * Default fields and relations to return
   */
  defaults?: (keyof TEntity | string)[]
  /**
   * @deprecated Use `defaults` instead
   */
  defaultFields?: (keyof TEntity | string)[]
  /**
   * @deprecated Use `defaultFields` instead and the relations will be inferred
   */
  defaultRelations?: string[]
  /**
   * Fields and relations that are allowed to be requested
   */
  allowed?: string[]
  /**
   * @deprecated Use `allowed` instead
   */
  allowedFields?: string[]
  /**
   * @deprecated Use `allowedFields` instead and the relations will be inferred
   */
  allowedRelations?: string[]
  defaultLimit?: number
  isList?: boolean
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
 * The response returned for a `DELETE` request.
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
