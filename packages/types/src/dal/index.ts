import { Dictionary, FilterQuery, Order } from "./utils"

export { FilterQuery } from "./utils"
export interface BaseFilterable<T> {
  $and?: (T | BaseFilterable<T>)[]
  $or?: (T | BaseFilterable<T>)[]
}

export interface OptionsQuery<T, P extends string = never> {
  populate?: string[]
  orderBy?: Order<T> | Order<T>[]
  limit?: number
  offset?: number
  fields?: string[]
  groupBy?: string | string[]
  filters?: Dictionary<boolean | Dictionary> | string[] | boolean
}

export type FindOptions<T = any> = {
  where: FilterQuery<T> & BaseFilterable<FilterQuery<T>>
  options?: OptionsQuery<T, any>
}

export * from "./repository-service"
export * from "./entity"
