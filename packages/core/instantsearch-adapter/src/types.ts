/**
 * Wire types for Medusa Search HTTP requests and InstantSearch's search client.
 * Kept local so the adapter has no runtime dependency on `@medusajs/types`.
 */

export type SearchFilterValue = string | number | boolean | null

export type SearchOperatorMap<T = SearchFilterValue> = {
  $eq?: T
  $ne?: T
  $in?: T[]
  $nin?: T[]
  $lt?: T
  $lte?: T
  $gt?: T
  $gte?: T
  $exists?: boolean
  $contains?: T | T[]
  $overlaps?: T[]
  $prefix?: string
  $like?: string
}

export type SearchFilters = {
  $and?: SearchFilters[]
  $or?: SearchFilters[]
  $not?: SearchFilters
  q?: string
} & {
  [field: string]:
    | SearchFilterValue
    | SearchFilterValue[]
    | SearchOperatorMap
    | SearchFilters
    | SearchFilters[]
    | undefined
}

export type SearchOrderBy = "ASC" | "DESC"

export type SearchMatchStrategy = "all" | "any" | "last"

export type SearchCountStrategy = "estimated" | "exact" | "none"

export type SearchFacetRequest =
  | {
      field: string
      type?: "value"
      limit?: number
      sort?: "count" | "alpha"
      query?: string
    }
  | {
      field: string
      type: "range"
      ranges: { key?: string; from?: number | string; to?: number | string }[]
    }
  | {
      field: string
      type: "stats"
    }

export interface SearchHighlightOptions {
  fields: string[]
  pre_tag?: string
  post_tag?: string
  snippet?: boolean | { length: number }
}

export interface SearchOptions {
  attributes_to_search_on?: string[]
  match_strategy?: SearchMatchStrategy
  typo_tolerance?: boolean
  facets?: (string | SearchFacetRequest)[]
  disjunctive_facets?: boolean
  highlight?: SearchHighlightOptions
  distinct?: string
  min_score?: number
  include_score?: boolean
  locales?: string[]
  vector?: {
    field?: string
    value?: number[]
    query?: string
    semantic_ratio?: number
  }
  count?: SearchCountStrategy
  provider_options?: Record<string, Record<string, unknown>>
}

export interface SearchPagination {
  skip?: number
  take?: number
  order?: Record<string, SearchOrderBy>
  cursor?: string
}

export interface SearchQuery {
  entity: string
  fields?: string[]
  filters?: SearchFilters
  pagination?: SearchPagination
  search_options?: SearchOptions
}

export interface SearchHit<T = Record<string, unknown>> {
  id: string
  score?: number
  document: T
  highlights?: Record<string, string[]>
}

export type SearchFacetResult =
  | {
      type: "value"
      values: { value: string; count: number }[]
      other_count?: number
    }
  | {
      type: "range"
      ranges: {
        key: string
        from?: number | string
        to?: number | string
        count: number
      }[]
    }
  | {
      type: "stats"
      min: number
      max: number
      avg?: number
      sum?: number
      count: number
    }

export interface SearchResultMetadata {
  skip: number
  take: number
  count: number | null
  next_cursor?: string
  query?: string
  processing_time_ms?: number
}

export interface SearchResult<T = Record<string, unknown>> {
  hits: SearchHit<T>[]
  facets?: Record<string, SearchFacetResult>
  metadata: SearchResultMetadata
  provider_metadata?: Record<string, unknown>
}

export type InstantSearchFacetFilters =
  | string
  | string[]
  | Array<string | string[]>

export type InstantSearchNumericFilters =
  | string
  | string[]
  | Array<string | string[]>

export interface InstantSearchSearchParams {
  query?: string
  page?: number
  hitsPerPage?: number
  facets?: string | string[]
  facetFilters?: InstantSearchFacetFilters
  numericFilters?: InstantSearchNumericFilters
  filters?: string
  maxValuesPerFacet?: number
  attributesToRetrieve?: string[]
  attributesToHighlight?: string[]
  highlightPreTag?: string
  highlightPostTag?: string
  attributesToSnippet?: string[]
  snippetEllipsisText?: string
  restrictSearchableAttributes?: string[]
  typoTolerance?: boolean | string | Record<string, unknown>
  distinct?: boolean | number
  sortFacetValuesBy?: "count" | "alpha"
  facetName?: string
  facetQuery?: string
  maxFacetHits?: number
  [key: string]: unknown
}

export interface InstantSearchRequest {
  indexName: string
  params?: InstantSearchSearchParams | string
}

export interface InstantSearchHighlightResult {
  value: string
  matchLevel: "none" | "partial" | "full"
  matchedWords: string[]
  fullyHighlighted?: boolean
}

export type HighlightResultNode =
  | InstantSearchHighlightResult
  | { [attribute: string]: HighlightResultNode }

export interface InstantSearchHit {
  objectID: string
  _highlightResult?: Record<string, HighlightResultNode>
  _snippetResult?: Record<string, HighlightResultNode>
  _score?: number
  [attribute: string]: unknown
}

export interface InstantSearchSearchResponse {
  hits: InstantSearchHit[]
  nbHits: number
  page: number
  nbPages: number
  hitsPerPage: number
  processingTimeMS: number
  query: string
  params: string
  index: string
  facets?: Record<string, Record<string, number>>
  facets_stats?: Record<
    string,
    { min: number; max: number; avg?: number; sum?: number }
  >
  exhaustiveNbHits: boolean
  exhaustiveFacetsCount?: boolean
  userData?: unknown[]
}

export interface InstantSearchFacetHit {
  value: string
  highlighted: string
  count: number
}

export interface InstantSearchFacetSearchResponse {
  facetHits: InstantSearchFacetHit[]
  exhaustiveFacetsCount: boolean
  processingTimeMS: number
}

export interface SearchClient {
  search: (
    requests: InstantSearchRequest[]
  ) => Promise<{ results: InstantSearchSearchResponse[] }>
  searchForFacetValues: (
    requests: InstantSearchRequest[]
  ) => Promise<InstantSearchFacetSearchResponse[]>
  clearCache: () => void
}

/**
 * Minimal JS SDK surface the adapter needs. Pass a `Medusa` instance, or any
 * object exposing `client.fetch`.
 */
export interface MedusaSdkLike {
  client: {
    fetch: (
      path: string,
      init?: {
        method?: string
        body?: unknown
        headers?: Record<string, string>
      }
    ) => Promise<unknown>
  }
}

export type SearchRequester = (
  queries: SearchQuery[]
) => Promise<SearchResult[]>

export type InstantSearchAdapterOptions = {
  /**
   * Medusa JS SDK instance. Preferred: it sends the publishable API key and
   * locale headers automatically.
   */
  sdk?: MedusaSdkLike
  /**
   * Custom transport. Receives the adapted `SearchQuery` list and must return
   * one `SearchResult` per query, in the same order.
   */
  requester?: SearchRequester
  /**
   * Medusa backend origin, used with native `fetch` when `sdk` and `requester`
   * are omitted. Example: `https://localhost:9000`.
   */
  baseUrl?: string
  /**
   * Search route path or absolute URL.
   *
   * @default "/store/search"
   */
  path?: string
  /**
   * Storefront publishable API key, sent as `x-publishable-api-key` when using
   * native `fetch`. Not needed when passing `sdk`.
   */
  publishableApiKey?: string
  /**
   * Extra headers merged into every request.
   */
  headers?: Record<string, string>
  /**
   * When true (default), POST `{ queries }` in one request. When false, POST
   * each `SearchQuery` individually.
   *
   * @default true
   */
  batch?: boolean
  /**
   * Fields InstantSearch range widgets use. Those facets are requested as
   * `stats` so `facets_stats` is populated. The index must opt the field into
   * stats (`facetable({ types: ["stats"] })`). Both the Postgres and
   * `search-medusa` providers support stats facets.
   */
  numericAttributes?: string[]
  /**
   * Index field used when InstantSearch sends `distinct: true`.
   */
  distinctAttribute?: string
  /**
   * Document field InstantSearch should use as `objectID` when a hit has no `id`.
   *
   * @default "id"
   */
  primaryKey?: string
  /**
   * When false, empty queries return no hits and do not call the backend.
   *
   * @default true
   */
  placeholderSearch?: boolean
  /**
   * Client-side cache TTL in seconds. `0` disables caching.
   *
   * @default 0
   */
  cacheSearchResultsForSeconds?: number
  /**
   * Defaults merged into every adapted query. Filters are ANDed with the
   * InstantSearch-derived filters; InstantSearch pagination and sort win.
   */
  additionalSearchParameters?: Partial<Omit<SearchQuery, "entity">>
  /**
   * Per-index overlay, keyed by InstantSearch `indexName` entity (without the
   * `/sort/...` suffix). Same merge rules as `additionalSearchParameters`.
   */
  indexSpecificSearchParameters?: Record<
    string,
    Partial<Omit<SearchQuery, "entity">>
  >
  /**
   * Escape hatch called after InstantSearch params are mapped to a `SearchQuery`.
   */
  transformQuery?: (
    query: SearchQuery,
    request: InstantSearchRequest
  ) => SearchQuery
  /**
   * Escape hatch called after a `SearchResult` is mapped to InstantSearch.
   */
  transformResponse?: (
    response: InstantSearchSearchResponse,
    result: SearchResult,
    request: InstantSearchRequest
  ) => InstantSearchSearchResponse
}

export const DEFAULT_SEARCH_PATH = "/store/search"
export const DEFAULT_HITS_PER_PAGE = 20
export const PUBLISHABLE_KEY_HEADER = "x-publishable-api-key"
export const SEARCH_SCORE_KEY = "_score"
