/**
 * One entity's results. Grouped rather than merged into a single list, because
 * relevance is only comparable within an index.
 */
export interface AdminSearchResultGroup<T = Record<string, unknown>> {
  entity: string
  /** The documents the index holds, in relevance order. */
  data: T[]
  /** Treat as an estimate — most engines only approximate a total. */
  count: number
  offset: number
  limit: number
}

export interface AdminSearchResponse<T = Record<string, unknown>> {
  /** In the order the entities were requested. */
  results: AdminSearchResultGroup<T>[]
}

/**
 * A leaf field stored in a search index, with the capabilities declared on it.
 */
export interface AdminSearchIndexField {
  /**
   * Dotted path of the field in the index, e.g. `title` or `variants.sku`.
   */
  name: string
  /**
   * The field's index type.
   */
  type: string
  /**
   * Whether the field is used for free-text matching.
   */
  searchable: boolean
  /**
   * Whether the field can be used in filters.
   */
  filterable: boolean
  /**
   * Whether results can be sorted by this field.
   */
  sortable: boolean
  /**
   * Whether the field can be faceted.
   */
  facetable: boolean
}

/**
 * Status of a search index:
 * - `pending` — created but not filled
 * - `building` — a seed or reindex is in progress
 * - `ready` — serving documents
 * - `error` — the last seed or reindex failed
 */
export type AdminSearchIndexStatus =
  | "pending"
  | "building"
  | "ready"
  | "error"

/**
 * A registered search index and the fields it stores.
 */
export interface AdminSearchIndex {
  /**
   * Unique index name, as used in `query.search({ entity })`.
   */
  name: string
  /**
   * The `query.graph` entrypoint used to hydrate non-indexed fields.
   */
  entity: string
  /**
   * Identifier of the provider backing this index.
   */
  provider: string
  /**
   * Lifecycle status of the index.
   */
  status: AdminSearchIndexStatus
  /**
   * Leaf fields stored in the index.
   */
  fields: AdminSearchIndexField[]
}

/**
 * The list of registered search indexes.
 */
export interface AdminSearchIndexListResponse {
  /**
   * The registered search indexes.
   */
  search_indexes: AdminSearchIndex[]
  /**
   * Whether the Search Module is enabled. When `false`, `search_indexes` is empty.
   */
  enabled: boolean
}

/**
 * The result of triggering a search index reindex. The reindex runs in the
 * background - check the index's `status` to know when it's done.
 */
export interface AdminSearchIndexReindexResponse {
  /**
   * Identifier of the triggered reindex job.
   */
  job_id: string
  /**
   * Names of the indexes being reindexed.
   */
  indexes: string[]
}
