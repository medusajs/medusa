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

  // `weight` lands at build time on some engines (Meilisearch and Algolia),
  // and at query time on others (Typesense and Elasticsearch).
  searchable?: boolean | { weight?: number }

  filterable?: boolean
  sortable?: boolean

  // Defaults to `["value"]`, or `["range"]` for numeric and date fields.
  // `"stats"` is opt-in: implying it would make numeric fields unusable on
  // providers without aggregations.
  facetable?: boolean | { types?: SearchFacetKind[] }

  /**
   * Whether the field comes back on hits. `false` for index-only fields, such as a
   * blob used purely for matching. `query.search` reads this to decide which
   * requested fields the engine can serve and which need `query.graph`.
   *
   * @default true
   */
  retrievable?: boolean

  /**
   * The `query.graph` filter path this field stands in for, when the two differ.
   * Lets a caller translate a database filter into an index one without the
   * index having to mirror the graph's naming — e.g. a flat
   * `variant_skus` field declaring `graph_path: "variants.sku"`.
   *
   * Defaults to the field's own path.
   */
  graph_path?: string

  // For `type: "object"`.
  fields?: Record<string, SearchFieldDefinition>

  /**
   * Only meaningful on an array of objects. When `true`, filters on the object's
   * sub-fields must all match within a *single* element — `variants.color = "red"
   * AND variants.size = "XL"` matches a product with a red XL variant, not one
   * with a red S and a blue XL. Off by default because most engines flatten
   * arrays and cannot express it; a provider that cannot rejects it from
   * `upsertIndex`, so this fails at boot rather than over-matching later.
   */
  correlated?: boolean

  /**
   * The dimensionality of the embedding stored in a `type: "vector"` field —
   * every vector written to it must have exactly this many components. Required
   * for vector fields; meaningless on any other type.
   */
  dimensions?: number

  // Keyed by provider identifier, e.g. `{ meilisearch: { ... } }`.
  provider_options?: Record<string, Record<string, unknown>>
}
