import { SchemaMetadata, SchemaType } from "../types"
import { NullableModifier } from "./nullable"

/**
 * The base schema class offers shared affordances to define
 * schema classes
 */
export abstract class BaseSchema<T> implements SchemaType<T> {
  #indexes: SchemaMetadata["indexes"] = []
  #relationships: SchemaMetadata["relationships"] = []
  #defaultValue?: T

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
    return new NullableModifier<T, this>(this)
  }

  /**
   * Define an index on the property
   */
  index(name?: string) {
    this.#indexes.push({ name, type: "index" })
    return this
  }

  /**
   * Define a unique index on the property
   */
  unique(name?: string) {
    this.#indexes.push({ name, type: "unique" })
    return this
  }

  /**
   * Define default value for the property
   */
  default(value: T) {
    this.#defaultValue = value
    return this
  }

  /**
   * Returns the serialized metadata
   */
  parse(fieldName: string): SchemaMetadata {
    return {
      fieldName,
      dataType: this.dataType,
      nullable: false,
      defaultValue: this.#defaultValue,
      indexes: this.#indexes,
      relationships: this.#relationships,
    }
  }
}
