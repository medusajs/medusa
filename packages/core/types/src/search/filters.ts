/**
 * A value a search filter can be compared against.
 */
export type SearchFilterValue = string | number | boolean | Date | null

/**
 * The operators a search filter can apply to a field.
 *
 * Filters are a tree rather than a string, because no two engines agree on a
 * filter syntax — Meilisearch, Typesense and Algolia each have their own DSL;
 * engines that take JSON filters compile from the same tree. A tree compiles to
 * all of them.
 *
 * `$prefix` and `$like` are not universal — Meilisearch has no substring filter
 * at all — so a provider without them rejects them.
 */
export type SearchOperatorMap<T> = {
  /**
   * The field must equal this value.
   */
  $eq?: T

  /**
   * The field must not equal this value.
   */
  $ne?: T

  /**
   * The field must equal one of these values.
   */
  $in?: T[]

  /**
   * The field must not equal any of these values.
   */
  $nin?: T[]

  /**
   * The field must be less than this value.
   */
  $lt?: T

  /**
   * The field must be less than or equal to this value.
   */
  $lte?: T

  /**
   * The field must be greater than this value.
   */
  $gt?: T

  /**
   * The field must be greater than or equal to this value.
   */
  $gte?: T

  /**
   * Whether the field must be set on the document.
   */
  $exists?: boolean

  /**
   * The array field must contain all of the given values.
   */
  $contains?: T | T[]

  /**
   * The array field must contain at least one of the given values.
   */
  $overlaps?: T[]

  /**
   * The field must start with this string.
   */
  $prefix?: string

  /**
   * The field must contain this substring.
   */
  $like?: string
}

/**
 * The name of an operator that a search filter can apply to a field.
 */
export type SearchFilterOperator = keyof SearchOperatorMap<unknown>

/**
 * The filters applied to a search query. Each key is either a logical operator,
 * the free-text query `q`, or a field path holding a value or an operator map.
 */
export type SearchFilters = {
  /**
   * Filters that must all match.
   */
  $and?: SearchFilters[]

  /**
   * Filters of which at least one must match.
   */
  $or?: SearchFilters[]

  /**
   * Filters that must not match.
   */
  $not?: SearchFilters

  /**
   * The free-text query. Sits among the filters so a `query.graph` call converts
   * to `query.search` unchanged; the module lifts it out before compiling the
   * rest, so a provider never sees `q` as a field.
   */
  q?: string
} & {
  /**
   * The value, or the operators, a field must match. The key is the field's
   * dotted path in the index, such as `title` or `variants.sku`.
   */
  [field: string]:
    | SearchFilterValue
    | SearchFilterValue[]
    | SearchOperatorMap<SearchFilterValue>
    | SearchFilters
    | SearchFilters[]
    | undefined
}
