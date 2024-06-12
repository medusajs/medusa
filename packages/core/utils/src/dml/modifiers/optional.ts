import { MaybeFieldMetadata } from "../types"
import { NullableModifier } from "./nullable"

/**
 * Optional modifier marks a schema node as optional/undefined.
 */
export class OptionalModifier<T> {
  /**
   * A type-only property to infer the JavScript data-type
   * of the schema property
   */
  declare $dataType: T | undefined

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
   * Apply nullable modifier on the schema
   */
  nullable() {
    return new NullableModifier<T | undefined>(this)
  }

  /**
   * Returns the serialized metadata
   */
  parse(fieldName: string) {
    const schema = this.#schema.parse(fieldName)
    schema.optional = true
    return schema
  }
}
