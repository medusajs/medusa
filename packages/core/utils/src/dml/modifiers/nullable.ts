import { MaybeFieldMetadata, RelationshipType, SchemaType } from "../types"

/**
 * Nullable modifier marks a schema node as nullable
 */
export class NullableModifier<
  T,
  Schema extends SchemaType<T> | RelationshipType<T>
> {
  /**
   * A type-only property to infer the JavScript data-type
   * of the schema property
   */
  declare $dataType: T | null

  /**
   * The parent schema on which the nullable modifier is
   * applied
   */
  #schema: Schema

  constructor(schema: Schema) {
    this.#schema = schema
  }

  /**
   * Returns the serialized metadata
   */
  parse(fieldName: string): ReturnType<Schema["parse"]> {
    const schema = this.#schema.parse(fieldName)
    schema.nullable = true
    return schema as ReturnType<Schema["parse"]>
  }
}
