import { SearchFieldKind } from "./field"

/**
 * A leaf field stored in a search index, with the capabilities declared on it.
 */
export interface SearchIndexFieldInfo {
  /**
   * Dotted path of the field in the index, e.g. `title` or `variants.sku`.
   */
  name: string
  /**
   * The field's index type.
   */
  type: SearchFieldKind
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
export type SearchIndexStatus = "pending" | "building" | "ready" | "error"

/**
 * A registered search index and the fields it stores.
 */
export interface SearchIndexDetails {
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
  status: SearchIndexStatus
  /**
   * Leaf fields stored in the index.
   */
  fields: SearchIndexFieldInfo[]
}
