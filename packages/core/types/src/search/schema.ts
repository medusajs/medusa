import { SchemaPropertyMetadata, SchemaPropertyType } from "../schema"
import { SearchDocument } from "./common"
import { SearchFacetKind, SearchFieldDefinition, SearchFieldKind } from "./field"
import { SearchIndexDefinition, SearchSeedContext } from "./index-definition"

/**
 * Schema of search index fields — key-value pairs of search properties.
 *
 * @since 2.18.1
 */
export type SearchSchema = Record<string, SearchPropertyType<any>>

/**
 * Runtime metadata produced by parsing a search property.
 *
 * @since 2.18.1
 */
export type SearchPropertyMetadata = SchemaPropertyMetadata & {
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
  correlated?: boolean
  dimensions?: number
  provider_options?: Record<string, Record<string, unknown>>
  fields?: Record<string, SearchPropertyMetadata>
}

/**
 * A search property that can be parsed into SearchPropertyMetadata.
 *
 * @since 2.18.1
 */
export type SearchPropertyType<T> = {
  $dataType: T
  parse(fieldName: string): SearchPropertyMetadata
} & SchemaPropertyType<T>

/**
 * Type-only marker `.array()` stamps on a property. It never exists at
 * runtime — document inference reads it to turn `$dataType` into an array.
 *
 * @since 2.18.1
 */
export interface SearchArrayMarker {
  $isArray: true
}

/**
 * The document value a single search property accepts. Every field may be
 * `null` — engines treat null as absent, and real documents carry nulls for
 * missing data.
 *
 * @since 2.18.1
 */
export type InferSearchPropertyValue<P extends SearchPropertyType<any>> =
  | (P extends SearchArrayMarker ? P["$dataType"][] : P["$dataType"])
  | null

/**
 * The value of an object field: declared sub-fields are type-checked, extra
 * keys are allowed — seeds commonly spread whole entities, and engines ignore
 * what the index does not declare.
 *
 * @since 2.18.1
 */
export type InferSearchObjectValue<Schema extends SearchSchema> = {
  [K in keyof Schema]?: InferSearchPropertyValue<Schema[K]>
} & Record<string, unknown>

/**
 * The document type an index accepts, inferred from its fields input. Plain
 * JSON fields carry no type information, so they fall back to SearchDocument.
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
 * Input accepted by `defineSearchIndex` for the `fields` property —
 * plain JSON or a DSL fields schema.
 */
export type SearchIndexFieldsInput =
  | Record<string, SearchFieldDefinition>
  | SearchFieldsSchemaLike

/**
 * Definition accepted by `defineSearchIndex` before fields are normalized.
 * When `fields` comes from the DSL, `seed` is type-checked against the
 * declared schema.
 */
export type SearchIndexDefinitionInput<
  Fields extends SearchIndexFieldsInput = SearchIndexFieldsInput
> = Omit<SearchIndexDefinition, "fields" | "seed"> & {
  fields: Fields
  // Ran when there is no data in the index or on reindex.
  seed: (
    context: SearchSeedContext
  ) => AsyncIterable<InferSearchDocumentType<Fields>[]>
}
