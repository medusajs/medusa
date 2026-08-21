import { SearchFilters } from "./filters"

// Reserved sort key that orders by relevance.
export const SEARCH_SCORE_KEY = "_score"

export type SearchOrderBy = "ASC" | "DESC"

export type SearchMatchStrategy = "all" | "any" | "last"

export type SearchCountStrategy = "estimated" | "exact" | "none"

export type SearchFacetRequest =
  | {
      field: string
      type?: "value"
      limit?: number
      sort?: "count" | "alpha"
      // Restrict the returned facet values to those matching this string.
      query?: string
    }
  | {
      field: string
      type: "range"
      ranges: {
        key?: string
        from?: number | string
        to?: number | string
      }[]
    }
  | {
      field: string
      type: "stats"
    }

export interface SearchHighlightOptions {
  fields: string[]
  // @default "<mark>"
  pre_tag?: string
  // @default "</mark>"
  post_tag?: string
  // Crop a fragment around the match rather than returning the whole field.
  snippet?: boolean | { length: number }
}

export interface SearchVectorOptions {
  field: string
  // A pre-computed embedding. Mutually exclusive with `query`.
  value?: number[]
  // Text to embed with the index' configured embedder.
  query?: string
  // 0 is keyword-only, 1 is semantic-only.
  semantic_ratio?: number
}

export interface SearchOptions {
  // Defaults to every field marked `searchable` on the index.
  attributes_to_search_on?: string[]
  /**
   * How query terms combine.
   *
   * - `"all"` (default): every term must appear as a complete token.
   * - `"any"`: at least one term must match.
   * - `"last"`: typeahead. Completed terms must match in full; the last term
   *   is a prefix, so `"my sear"` matches `"My search results"`.
   */
  match_strategy?: SearchMatchStrategy
  typo_tolerance?: boolean

  facets?: (string | SearchFacetRequest)[]

  /**
   * Compute each facet ignoring the filter on that same field, so a storefront
   * keeps showing sibling values of an active filter. Needs one query per facet
   * on every engine reviewed, so the module fans out over `searchMany`.
   */
  disjunctive_facets?: boolean

  highlight?: SearchHighlightOptions

  // Return at most one hit per distinct value of this field.
  distinct?: string
  min_score?: number
  include_score?: boolean

  /**
   * Query-time language hint, e.g. `["en"]`. Engines that analyze per language
   * (Meilisearch, Algolia) use it to pick the analyzer; a provider that cannot
   * honour it rejects it rather than silently matching differently. Defaults to
   * the index' `settings.locales`.
   */
  locales?: string[]

  vector?: SearchVectorOptions

  /**
   * `"exact"` may be rejected or slow depending on the provider.
   *
   * @default "estimated"
   */
  count?: SearchCountStrategy

  /**
   * Escape hatch for engine features the interface does not model, keyed by
   * provider identifier, e.g. `{ typesense: { drop_tokens_threshold: 0 } }`.
   */
  provider_options?: Record<string, Record<string, unknown>>
}

export interface SearchPagination {
  skip?: number
  take?: number
  // `_score` is reserved for relevance.
  order?: Record<string, SearchOrderBy>
  // Opaque provider cursor. Mutually exclusive with `skip`.
  cursor?: string
}

export interface SearchQuery<TEntry extends string = string> {
  // The index to query, defaulting to the index whose name equals the entity.
  entity: TEntry

  // The fields the engine should return. Only fields available in the search engine can be passed here.
  fields?: string[]

  // Filters to apply, including the free-text query as `q`.
  filters?: SearchFilters
  pagination?: SearchPagination
  search_options?: SearchOptions
}
