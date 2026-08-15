import type {
  AttributeSchemaConfig,
  DistanceMetric,
  FullTextSearch,
  ShardingConfig,
} from "./api-types"

export type MedusaSearchProviderOptions = {
  /**
   * API key for authenticating with Medusa Cloud search.
   */
  api_key: string
  /**
   * Medusa Cloud search proxy base URL.
   */
  endpoint: string
  /**
   * Cloud environment handle. Cloud scopes physical storage from this
   * handle — the provider sends Medusa index names as-is.
   */
  environment_handle: string
}

export type MedusaSearchIndexOptions = {
  distance_metric?: DistanceMetric
  sharding?: ShardingConfig
}

export type MedusaSearchFieldOptions = {
  type?: string
  ann?: AttributeSchemaConfig["ann"]
  filterable?: boolean
  full_text_search?: FullTextSearch
  fuzzy?: boolean
  glob?: boolean
  regex?: boolean
}

export type MedusaSearchQueryOptions = {
  consistency?: "strong" | "eventual"
}
