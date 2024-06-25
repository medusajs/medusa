import { PropertyType } from "@medusajs/types"

const IsNullableModifier = Symbol.for("isNullableModifier")
/**
 * Nullable modifier marks a schema node as nullable
 */
export class NullableModifier<T, Schema extends PropertyType<T>>
  implements PropertyType<T | null>
{
  [IsNullableModifier]: true = true

  static isNullableModifier(obj: any): obj is NullableModifier<any, any> {
    return !!obj?.[IsNullableModifier]
  }
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
  parse(fieldName: string) {
    const schema = this.#schema.parse(fieldName)
    schema.nullable = true
    return schema
  }
}
