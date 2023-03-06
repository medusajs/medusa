import {
  FindManyOptions,
  FindOneOptions,
  FindOperator,
  FindOptionsOrder,
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
  OrderByCondition,
} from "typeorm"
import { BaseEntity } from "../base-entity"

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

export interface CustomFindOptions<TModel, InKeys extends keyof TModel> {
  select?: FindManyOptions<TModel>["select"]
  where?: FindManyOptions<TModel>["where"] & {
    [P in InKeys]?: TModel[P][]
  }
  order?: OrderByCondition
  skip?: number
  take?: number
}
export type RequestQueryFields = {
  expand?: string
  fields?: string
  offset?: number
  limit?: number
  order?: string
}

export type QueryConfig<TEntity extends BaseEntity> = {
  defaultFields?: (keyof TEntity | string)[]
  defaultRelations?: string[]
  allowedFields?: string[]
  allowedRelations?: string[]
  defaultLimit?: number
  isList?: boolean
}

export type DateComparisonOperator = {
  lt?: Date

  gt?: Date

  gte?: Date

  lte?: Date
}

export type StringComparisonOperator = {
  lt?: string

  gt?: string

  gte?: string

  lte?: string
}

export type NumericalComparisonOperator = {
  lt?: number

  gt?: number

  gte?: number

  lte?: number
}
