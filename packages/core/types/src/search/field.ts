/**
 * The type of a field in a search index:
 *
 * - `keyword`: exact-match text, such as IDs, handles, and enum or facet values.
 * - `text`: text analyzed for free-text matching.
 * - `integer`, `float`, `boolean`, `date`: scalar values.
 * - `geo`: a geographic point.
 * - `object`: a nested object, whose fields are declared in `fields`.
 * - `vector`: an embedding, whose dimensionality is declared in `dimensions`.
 */
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

/**
 * The type of faceting supported on a field:
 *
 * - `value`: counts per distinct value.
 * - `range`: counts per numeric or date range.
 * - `stats`: aggregations, such as the minimum and maximum, over the field.
 */
export type SearchFacetKind = "value" | "range" | "stats"

/**
 * A field in a search index, and what the index can do with it.
 */
export interface SearchFieldDefinition {
  /**
   * The field's type.
   */
  type: SearchFieldKind

  /**
   * Whether the field holds an array of the declared `type`.
   */
  array?: boolean

  /**
   * Whether the field is matched against a free-text query, optionally with a
   * `weight` boosting its relevance. The weight is applied at build time on some
   * engines, such as Meilisearch and Algolia, and at query time on others, such
   * as Typesense and Elasticsearch.
   */
  searchable?: boolean | { weight?: number }

  /**
   * Whether the field can be used in a query's filters.
   */
  filterable?: boolean

  /**
   * Whether results can be sorted by the field.
   */
  sortable?: boolean

  /**
   * Whether the field can be faceted, and which facet types it supports.
   * Defaults to `["value"]`, or `["range"]` for numeric and date fields.
   * `"stats"` is opt-in, since implying it would make numeric fields unusable on
   * providers without aggregations.
   */
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
   * The fields of a nested object, only used when `type` is `object`.
   */
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
   * The dimensionality of the embedding stored in a `type: "vector"` field.
   * Required for vector fields; meaningless on any other type. When `embed` is
   * omitted, every vector written to the field must have exactly this many
   * components.
   */
  dimensions?: number

  /**
   * When set on a vector field, the dotted path of the text or keyword field
   * the engine embeds at write and query time. Documents must not include this
   * field's values — pass the raw text on that source field instead. Omit
   * `embed` to supply embeddings yourself.
   */
  embed?: string

  /**
   * Field options specific to a search engine, keyed by provider identifier, such
   * as `{ meilisearch: { ... } }`.
   */
  provider_options?: Record<string, Record<string, unknown>>
}
