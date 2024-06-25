import { PropertyType } from "@medusajs/types"

/**
 * Searchable modifier marks a schema node as searchable
 */
export class SearchableModifier<T, Schema extends PropertyType<T>>
  implements PropertyType<T>
{
  /**
   * A type-only property to infer the JavScript data-type
   * of the schema property
   */
  declare $dataType: T

  /**
   * The parent schema on which the searchable modifier is
   * applied
   */
  #schema: Schema

  constructor(schema: Schema) {
    this.#schema = schema
  }

  /**
   * Returns the serialized metadata
   */
  parse(fieldName: string) {
    const schema = this.#schema.parse(fieldName)
    schema.searchable = true
    return schema
  }
}
