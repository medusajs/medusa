/**
 * Wire types for the Medusa Cloud search proxy.
 */

export type AttributeType = string

export type AttributeSchema = AttributeType | AttributeSchemaConfig

export type FullTextSearch = boolean | Record<string, unknown>

export type DistanceMetric = "cosine_distance" | "euclidean_squared"

export type ShardingConfig = {
  num_shards: number
  [key: string]: unknown
}

export type AttributeSchemaConfig = {
  type: AttributeType
  ann?: boolean | { distance_metric?: DistanceMetric; late_interaction?: boolean }
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

export type Filter =
  | [string, string, unknown]
  | ["And" | "Or", Filter[]]
  | ["Not", Filter]

export type RankBy = unknown

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
