/**
 * Wire types for the Medusa Cloud search proxy.
 */

export type AttributeType = string

export type AttributeSchema = AttributeType | AttributeSchemaConfig

// Every field is optional and falls back to Medusa's own default (in particular,
// `case_sensitive` defaults to `false` — BM25 matching is case-insensitive
// out of the box). Tokenizer selection is not exposed — it's always the
// engine's default (word_v4).
export type FullTextSearchConfig = {
  language?: string
  case_sensitive?: boolean
  stemming?: boolean
  remove_stopwords?: boolean
  ascii_folding?: boolean
  max_token_length?: number
  // BM25 configuration knobs, see BM25 definition for more info.
  k1?: number
  b?: number
  k3?: number
}

export type FullTextSearch = boolean | FullTextSearchConfig

export type DistanceMetric = "cosine_distance" | "euclidean_squared"

export type ShardingConfig = {
  num_shards: number
  [key: string]: unknown
}

export type AttributeSchemaConfig = {
  type: AttributeType
  ann?:
    | boolean
    | { distance_metric?: DistanceMetric; late_interaction?: boolean }
  filterable?: boolean
  full_text_search?: FullTextSearch
  fuzzy?: boolean
  glob?: boolean
  regex?: boolean
}

export type Row = Record<string, unknown> & {
  id: string | number
  $dist?: number
}

export type FuzzyEditDistanceThreshold = {
  min_query_chars: number
  distance: number
}

export type FuzzyFilterOptions = {
  max_edit_distance: FuzzyEditDistanceThreshold[]
  case_sensitive?: boolean
}

export type Filter =
  | [string, string, unknown]
  | [string, "Fuzzy", string, FuzzyFilterOptions]
  | ["And" | "Or", Filter[]]
  | ["Not", Filter]

export type RankBy = unknown

export type HighlightFragmentGranularity =
  | "word"
  | "sentence"
  | "paragraph"
  | "none"

export type HighlightExpression = [
  "Highlight",
  string,
  {
    fragment_by?: HighlightFragmentGranularity
    rank_fragments_by?: RankBy
    fragment_limit?: number
    include_offsets?: "utf-8" | "utf-16" | "codepoints"
  }
]

export type HighlightFragment = {
  text: string
  fragment_range?: [number, number]
  match_ranges?: [number, number][]
}

export type ComputeAttributes = Record<string, HighlightExpression>

export type Limit =
  | number
  | {
      total: number
      per?: { attributes: string[]; limit: number }
    }

export type AggregationGroup = {
  value?: unknown
  count?: unknown
  [key: string]: unknown
}

export type IndexMetadata = {
  approx_logical_bytes: number
  approx_row_count: number
  created_at: string
  updated_at: string
  schema: Record<string, AttributeSchemaConfig>
  [key: string]: unknown
}

export type IndexCreateParams = {
  name: string
  schema: Record<string, AttributeSchema>
  distance_metric?: DistanceMetric
  sharding?: ShardingConfig
}

export type IndexQuery = {
  rank_by?: RankBy
  filters?: Filter
  include_attributes?: string[] | boolean
  limit?: number | Limit
  top_k?: number
  aggregate_by?: Record<string, unknown>
  group_by?: Array<Record<string, unknown>>
  consistency?: { level: "strong" | "eventual" }
  distance_metric?: DistanceMetric
  compute_attributes?: ComputeAttributes
}

export type IndexMultiQueryParams = {
  queries: IndexQuery[]
  consistency?: { level: "strong" | "eventual" }
}

export type IndexQueryResult = {
  rows?: Row[]
  aggregations?: Record<string, unknown>
  aggregation_groups?: AggregationGroup[]
}

export type IndexMultiQueryResponse = {
  results: IndexQueryResult[]
  billing?: Record<string, unknown>
  performance: {
    server_total_ms?: number
    approx_index_size?: number
    [key: string]: unknown
  }
}

export type IndexWriteParams = {
  upsert_rows?: Row[]
  schema?: Record<string, AttributeSchema>
  distance_metric?: DistanceMetric
  sharding?: ShardingConfig
  delete_by_filter?: Filter
  delete_by_filter_allow_partial?: boolean
}

export type IndexWriteResponse = {
  rows_remaining?: boolean
  [key: string]: unknown
}

export type IndexSummary = {
  id: string
}
