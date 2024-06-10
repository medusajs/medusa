import { SchemaMetadata, SchemaType } from "../types"
import { NullableModifier } from "../modifiers/nullable"
import { OptionalModifier } from "../modifiers/optional"

/**
 * The base schema class offers shared affordances to define
 * schema classes
 */
export abstract class BaseSchema<T> implements SchemaType<T> {
  #indexes: SchemaMetadata["indexes"] = []
  #relationships: SchemaMetadata["relationships"] = []

  /**
   * The runtime dataType for the schema. It is not the same as
   * the "$dataType".
   */
  protected abstract dataType: SchemaMetadata["dataType"]

  /**
   * A type-only property to infer the JavScript data-type
   * of the schema property
   */
  declare $dataType: T

  /**
   * Apply nullable modifier on the schema
   */
  nullable() {
    return new NullableModifier<T>(this)
  }

  /**
   * Apply optional modifier on the schema
   */
  optional() {
    return new OptionalModifier<T>(this)
  }

  /**
   * Returns the serialized metadata
   */
  parse(fieldName: string): SchemaMetadata {
    return {
      fieldName,
      dataType: this.dataType,
      nullable: false,
      optional: false,
      indexes: this.#indexes,
      relationships: this.#relationships,
    }
  }
}
