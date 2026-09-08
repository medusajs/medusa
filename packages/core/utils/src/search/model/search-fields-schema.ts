import {
  SearchFieldDefinition,
  SearchFieldsSchemaLike,
  SearchPropertyMetadata,
  SearchSchema,
} from "@medusajs/types"

const IsSearchFieldsSchema = Symbol.for("isSearchFieldsSchema")

/**
 * A fields schema produced by `search.define(...)`. Compiles to plain
 * SearchFieldDefinition records for the Search Module.
 */
export class SearchFieldsSchema<Schema extends SearchSchema>
  implements SearchFieldsSchemaLike
{
  [IsSearchFieldsSchema] = true

  /**
   * The DSL schema. Public so document types can be inferred from it —
   * see InferSearchDocumentType.
   */
  schema: Schema

  constructor(schema: Schema) {
    this.schema = schema
  }

  static isSearchFieldsSchema(
    value: unknown
  ): value is SearchFieldsSchema<any> {
    return !!value?.[IsSearchFieldsSchema]
  }

  /**
   * Compile the DSL schema into plain SearchFieldDefinition records.
   */
  toFields(): Record<string, SearchFieldDefinition> {
    const fields: Record<string, SearchFieldDefinition> = {}

    for (const [fieldName, property] of Object.entries(this.schema)) {
      fields[fieldName] = metadataToFieldDefinition(property.parse(fieldName))
    }

    return fields
  }
}

function metadataToFieldDefinition(
  metadata: SearchPropertyMetadata
): SearchFieldDefinition {
  const field: SearchFieldDefinition = {
    type: metadata.dataType.name,
  }

  if (metadata.array !== undefined) {
    field.array = metadata.array
  }
  if (metadata.searchable !== undefined) {
    field.searchable = metadata.searchable
  }
  if (metadata.filterable !== undefined) {
    field.filterable = metadata.filterable
  }
  if (metadata.sortable !== undefined) {
    field.sortable = metadata.sortable
  }
  if (metadata.facetable !== undefined) {
    field.facetable = metadata.facetable
  }
  if (metadata.retrievable !== undefined) {
    field.retrievable = metadata.retrievable
  }
  if (metadata.dimensions !== undefined) {
    field.dimensions = metadata.dimensions
  }
  if (metadata.embed !== undefined) {
    field.embed = metadata.embed
  }
  if (metadata.provider_options !== undefined) {
    field.provider_options = metadata.provider_options
  }
  if (metadata.fields) {
    field.fields = {}
    for (const [name, nested] of Object.entries(metadata.fields)) {
      field.fields[name] = metadataToFieldDefinition(nested)
    }
  }

  return field
}
