import { SearchFilters } from "./filters"

/**
 * Reserved sort key that orders results by relevance score.
 */
// Reserved sort key that orders by relevance.
export const SEARCH_SCORE_KEY = "_score"

/**
 * The sort direction for search results.
 */
export type SearchOrderBy = "ASC" | "DESC"

/**
 * The strategy used to match query terms against indexed documents.
 */
export type SearchMatchStrategy = "all" | "any" | "last"

/**
 * The strategy used to count the total number of search results.
 */
export type SearchCountStrategy = "estimated" | "exact" | "none"

/**
 * The facet aggregation request configuration for a search query.
 */
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

/**
 * The highlighting options for search result fields.
 */
export interface SearchHighlightOptions {
  /**
   * The fields to highlight in the search results.
   */
  fields: string[]
  // @default "<mark>"
  /**
   * The HTML tag inserted before a highlighted match.
   */
  pre_tag?: string
  // @default "</mark>"
  /**
   * The HTML tag inserted after a highlighted match.
   */
  post_tag?: string
  // Crop a fragment around the match rather than returning the whole field.
  /**
   * Whether to crop a short fragment around the match instead of returning the whole field value.
   */
  snippet?: boolean | { length: number }
}

/**
 * The vector search options for a search query.
 */
export interface SearchVectorOptions {
  /**
   * The index field containing the vector embeddings to search against.
   */
  field: string
  // A pre-computed embedding. Mutually exclusive with `query`.
  /**
   * A pre-computed embedding vector. Mutually exclusive with `query`.
   */
  value?: number[]
  // Text to embed with the index' configured embedder.
  /**
   * Text to embed using the index's configured embedder. Mutually exclusive with `value`.
   */
  query?: string
  // 0 is keyword-only, 1 is semantic-only.
  /**
   * The balance between keyword and semantic search, where `0` is keyword-only and `1` is semantic-only.
   */
  semantic_ratio?: number
}

/**
 * The options that control how a search query is executed.
 */
export interface SearchOptions {
  // Defaults to every field marked `searchable` on the index.
  /**
   * The fields to search on. Defaults to every field marked `searchable` on the index.
   */
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
  /**
   * Whether to allow typo-tolerant matching for query terms.
   */
  typo_tolerance?: boolean

  /**
   * The facet aggregations to compute alongside the search results.
   */
  facets?: (string | SearchFacetRequest)[]

  /**
   * Compute each facet ignoring the filter on that same field, so a storefront
   * keeps showing sibling values of an active filter. Needs one query per facet
   * on every engine reviewed, so the module fans out over `searchMany`.
   */
  disjunctive_facets?: boolean

  /**
   * The highlighting options to apply to matched fields in the results.
   */
  highlight?: SearchHighlightOptions

  // Return at most one hit per distinct value of this field.
  /**
   * The field used to deduplicate results, returning at most one hit per distinct value.
   */
  distinct?: string
  /**
   * The minimum relevance score a result must have to be included in the response.
   */
  min_score?: number
  /**
   * Whether to include the relevance score of each result in the response.
   */
  include_score?: boolean

  /**
   * Query-time language hint, e.g. `["en"]`. Engines that analyze per language
   * (Meilisearch, Algolia) use it to pick the analyzer; a provider that cannot
   * honour it rejects it rather than silently matching differently. Defaults to
   * the index' `settings.locales`.
   */
  locales?: string[]

  /**
   * The vector search options for semantic or hybrid search.
   */
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

/**
 * The pagination and sorting options for a search query.
 */
export interface SearchPagination {
  /**
   * The number of results to skip.
   */
  skip?: number
  /**
   * The maximum number of results to return.
   */
  take?: number
  // `_score` is reserved for relevance.
  /**
   * The fields and directions to sort results by. Use `_score` to sort by relevance.
   */
  order?: Record<string, SearchOrderBy>
  // Opaque provider cursor. Mutually exclusive with `skip`.
  /**
   * An opaque cursor for cursor-based pagination. Mutually exclusive with `skip`.
   */
  cursor?: string
}

/**
 * The parameters of a search query targeting a single index.
 */
export interface SearchQuery<TEntry extends string = string> {
  // The index to query, defaulting to the index whose name equals the entity.
  /**
   * The entity name identifying the index to query.
   */
  entity: TEntry

  // The fields the engine should return. Only fields available in the search engine can be passed here.
  /**
   * The fields to return in each result. Only fields available in the search engine can be specified.
   */
  fields?: string[]

  // Filters to apply, including the free-text query as `q`.
  /**
   * The filters to apply to the search, including the free-text query as `q`.
   */
  filters?: SearchFilters
  /**
   * The pagination options for the search results.
   */
  pagination?: SearchPagination
  /**
   * The additional search options controlling query execution behavior.
   */
  search_options?: SearchOptions
}
