import { MaybeFieldMetadata } from "../types"
import { OptionalModifier } from "./optional"

/**
 * Nullable modifier marks a schema node as nullable
 */
export class NullableModifier<T> {
  /**
   * A type-only property to infer the JavScript data-type
   * of the schema property
   */
  declare $dataType: T | null

  /**
   * The parent schema on which the nullable modifier is
   * applied
   */
  #schema: {
    parse(fieldName: string): MaybeFieldMetadata
  }

  constructor(schema: { parse(fieldName: string): MaybeFieldMetadata }) {
    this.#schema = schema
  }

  /**
   * Apply optional modifier on the schema
   */
  optional() {
    return new OptionalModifier<T | null>(this)
  }

  /**
   * Returns the serialized metadata
   */
  parse(fieldName: string) {
    const schema = this.#schema.parse(fieldName)
    schema.nullable = true
    return schema
  }
}
