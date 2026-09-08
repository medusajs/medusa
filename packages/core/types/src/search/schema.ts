import { SchemaPropertyMetadata, SchemaPropertyType } from "../schema"
import { SearchDocument } from "./common"
import {
  SearchFacetKind,
  SearchFieldDefinition,
  SearchFieldKind,
} from "./field"
import {
  SearchIndexDefinition,
  SearchMutation,
  SearchSeedContext,
} from "./index-definition"

/**
 * Schema of search index fields — key-value pairs of search properties.
 *
 * @since 2.19.0
 */
export type SearchSchema = Record<string, SearchPropertyType<any>>

/**
 * Runtime metadata produced by parsing a search property.
 * `T` types `defaultValue` to match `$dataType` (search fields rarely set one).
 *
 * @since 2.19.0
 */
export type SearchPropertyMetadata<T = any> = SchemaPropertyMetadata<T> & {
  dataType: {
    name: SearchFieldKind
    options?: Record<string, any>
  }
  searchable?: boolean | { weight?: number }
  filterable?: boolean
  sortable?: boolean
  facetable?: boolean | { types?: SearchFacetKind[] }
  retrievable?: boolean
  array?: boolean
  dimensions?: number
  embed?: boolean
  provider_options?: Record<string, Record<string, unknown>>
  fields?: Record<string, SearchPropertyMetadata>
}

/**
 * A search property that can be parsed into SearchPropertyMetadata.
 *
 * @since 2.19.0
 */
export type SearchPropertyType<T> = {
  $dataType: T
  parse(fieldName: string): SearchPropertyMetadata<T>
} & SchemaPropertyType<T>

/**
 * Type-only marker `.array()` stamps on a property. It never exists at
 * runtime — document inference reads it to turn `$dataType` into an array.
 *
 * @since 2.19.0
 */
export interface SearchArrayMarker {
  $isArray: true
}

/**
 * The document value a single search property accepts. Every field may be
 * `null` — engines treat null as absent, and real documents carry nulls for
 * missing data.
 *
 * @since 2.19.0
 */
export type InferSearchPropertyValue<P extends SearchPropertyType<any>> =
  | (P extends SearchArrayMarker ? P["$dataType"][] : P["$dataType"])
  | null

/**
 * The value of an object field: declared sub-fields are type-checked, extra
 * keys are allowed — seeds commonly spread whole entities, and engines ignore
 * what the index does not declare.
 *
 * @since 2.19.0
 */
export type InferSearchObjectValue<Schema extends SearchSchema> = {
  [K in keyof Schema]?: InferSearchPropertyValue<Schema[K]>
} & Record<string, unknown>

/**
 * The document type an index accepts, inferred from its `search.define(...)`
 * fields schema.
 */
export type InferSearchDocumentType<Fields extends SearchIndexFieldsInput> =
  Fields extends { schema: infer Schema extends SearchSchema }
    ? InferSearchObjectValue<Schema> & { id: string }
    : SearchDocument

/**
 * A fields schema produced by `search.define(...)`. Compiles to plain
 * SearchFieldDefinition records via `toFields()`.
 */
export interface SearchFieldsSchemaLike {
  toFields(): Record<string, SearchFieldDefinition>
}

/**
 * Input accepted by `defineSearchIndex` for the `fields` property — a
 * schema from `search.define({ ... })`.
 */
export type SearchIndexFieldsInput = SearchFieldsSchemaLike

/**
 * A `seed` mutation, with `upsert`'s documents type-checked against the
 * declared `search.define(...)` schema.
 */
export type SearchIndexSeedMutation<Fields extends SearchIndexFieldsInput> =
  | { action: "upsert"; documents: InferSearchDocumentType<Fields>[] }
  | Extract<SearchMutation, { action: "delete" }>

/**
 * Definition accepted by `defineSearchIndex` before fields are normalized.
 * `seed` is type-checked against the declared `search.define(...)` schema.
 */
export type SearchIndexDefinitionInput<
  Fields extends SearchIndexFieldsInput = SearchIndexFieldsInput
> = Omit<SearchIndexDefinition, "fields" | "seed"> & {
  fields: Fields
  // Ran when there is no data in the index, on reindex, and for the
  // catch-up pass after a full seed.
  seed: (
    context: SearchSeedContext
  ) => AsyncIterable<SearchIndexSeedMutation<Fields>[]>
}
