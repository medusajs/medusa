import type {
  AttributeSchemaConfig,
  DistanceMetric,
  FullTextSearch,
} from "./api-types"

export type MedusaSearchProviderOptions = {
  /**
   * Bearer token for authenticating with Medusa Cloud search. Used only when
   * the endpoint is not a basic auth-protected URL.
   */
  api_key?: string
  /**
   * Medusa Cloud search proxy base URL. Typically a basic auth URL for local access
   * And a standard HTTP URL in Cloud
   */
  endpoint: string
  /**
   * Cloud environment handle. Cloud scopes physical storage from this
   * handle — the provider sends Medusa index names as-is. Used only when the
   * endpoint is not a basic auth-protected URL, which carries the handle as
   * the user.
   */
  environment_handle?: string
}

export type ResolvedMedusaSearchProviderOptions =
  MedusaSearchProviderOptions & {
    api_key: string
    environment_handle: string
  }

export type MedusaSearchIndexOptions = {
  distance_metric?: DistanceMetric
}

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
