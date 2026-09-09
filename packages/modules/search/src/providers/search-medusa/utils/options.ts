import type {
  AttributeSchemaConfig,
  DistanceMetric,
  FullTextSearch,
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
}

/**
 * Field options with no portable equivalent in `SearchFieldDefinition`. The
 * column type and whether it is filterable are derived from the field
 * definition itself, and typo tolerance from `settings.typo_tolerance`, so
 * none of those are overridable here.
 */
export type MedusaSearchFieldOptions = {
  ann?: AttributeSchemaConfig["ann"]
  full_text_search?: FullTextSearch
  /**
   * Build a trigram index so `$prefix` / `$like` filters can glob-match
   * this string. Defaults to `true` for filterable, sortable, or
   * facetable keywords. Text fields must set this to `true` explicitly.
   * Always omitted on `id` — that column is the document key.
   */
  glob?: boolean
  regex?: boolean
}

export type MedusaSearchQueryOptions = {
  consistency?: "strong" | "eventual"
}
