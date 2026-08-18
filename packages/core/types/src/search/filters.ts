/**
 * A primitive value that can appear in a search filter.
 */
export type SearchFilterValue = string | number | boolean | Date | null

/**
 * A tree rather than a string, because no two engines agree on a filter syntax —
 * Meilisearch, Typesense and Algolia each have their own DSL; engines that take
 * JSON filters compile from the same tree. A tree compiles to all of them.
 *
 * `$prefix` and `$like` are not universal — Meilisearch has no substring filter
 * at all — so a provider without them rejects them.
 */
export type SearchOperatorMap<T> = {
  $eq?: T
  $ne?: T
  $in?: T[]
  $nin?: T[]
  $lt?: T
  $lte?: T
  $gt?: T
  $gte?: T
  $exists?: boolean
  // Array contains all of the given values.
  $contains?: T | T[]
  // Array contains at least one of the given values.
  $overlaps?: T[]
  $prefix?: string
  $like?: string
}

/**
 * A valid operator key from {@link SearchOperatorMap}.
 */
export type SearchFilterOperator = keyof SearchOperatorMap<unknown>

/**
 * A structured filter tree used to express search query conditions.
 * Supports logical combinators (`$and`, `$or`, `$not`) and per-field operator maps.
 */
export type SearchFilters = {
  $and?: SearchFilters[]
  $or?: SearchFilters[]
  $not?: SearchFilters
  /**
   * The free-text query. Sits among the filters so a `query.graph` call converts
   * to `query.search` unchanged; the module lifts it out before compiling the
   * rest, so a provider never sees `q` as a field.
   */
  q?: string
} & {
  [field: string]:
    | SearchFilterValue
    | SearchFilterValue[]
    | SearchOperatorMap<SearchFilterValue>
    | SearchFilters
    | SearchFilters[]
    | undefined
}
