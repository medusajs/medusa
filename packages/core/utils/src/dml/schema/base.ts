import { SchemaMetaData } from "../types"
import { NullableModifier } from "../modifiers/nullable"
import { OptionalModifier } from "../modifiers/optional"

/**
 * The base schema class offers shared affordances to define
 * schema classes
 */
export abstract class BaseSchema<T> {
  #indexes: SchemaMetaData["indexes"] = []
  #relationships: SchemaMetaData["relationships"] = []

  /**
   * The runtime dataType for the schema. It is not the same as
   * the "$dataType".
   */
  protected abstract dataType: SchemaMetaData["dataType"]

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
  parse(fieldName: string): SchemaMetaData {
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
