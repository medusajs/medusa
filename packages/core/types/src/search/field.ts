// `keyword` is exact-match — ids, handles, enum and facet values. `text` is
// analyzed for free-text matching. Every engine draws the same line.
export type SearchFieldKind =
  | "keyword"
  | "text"
  | "integer"
  | "float"
  | "boolean"
  | "date"
  | "geo"
  | "object"
  | "vector"

export type SearchFacetKind = "value" | "range" | "stats"

export interface SearchFieldDefinition {
  type: SearchFieldKind
  array?: boolean

  // `weight` lands at build time on Meilisearch and Algolia, at query time on
  // Typesense and Elasticsearch.
  searchable?: boolean | { weight?: number }

  filterable?: boolean
  sortable?: boolean

  // Defaults to `["value"]`, or `["range"]` for numeric and date fields.
  // `"stats"` is opt-in: implying it would make numeric fields unusable on
  // providers without aggregations.
  facetable?: boolean | { types?: SearchFacetKind[] }

  /**
   * Whether the field comes back on hits. `false` for index-only fields, such as
   * a blob used purely for matching. Splits requested fields between the engine
   * and `query.graph`.
   *
   * @default true
   */
  retrievable?: boolean

  // For `type: "object"`.
  fields?: Record<string, SearchFieldDefinition>

  /**
   * For an array of objects, require filters to correlate per element — that
   * `variants.color = "red" AND variants.size = "XL"` match one variant, not the
   * union. A provider that cannot rejects it from `upsertIndex`, so this fails at
   * boot rather than over-matching later.
   */
  correlated?: boolean

  // For `type: "vector"`.
  dimensions?: number

  // Keyed by provider identifier, e.g. `{ meilisearch: { ... } }`.
  provider_options?: Record<string, Record<string, unknown>>
}
