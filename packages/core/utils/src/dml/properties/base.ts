import { PropertyMetadata, PropertyType } from "@medusajs/types"
import { NullableModifier } from "./nullable"

/**
 * The BaseProperty class offers shared affordances to define
 * property classes
 */
export abstract class BaseProperty<T> implements PropertyType<T> {
  /**
   * Defined indexes and relationships
   */
  #indexes: PropertyMetadata["indexes"] = []
  #relationships: PropertyMetadata["relationships"] = []

  /**
   * Default value for the property
   */
  #defaultValue?: T

  /**
   * Whether the property is searchable through free text search
   * @private
   */
  #searchable: boolean = false

  /**
   * The runtime dataType for the schema. It is not the same as
   * the "$dataType".
   */
  protected abstract dataType: PropertyMetadata["dataType"]

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

  searchable() {
    this.#searchable = true
    return this
  }

  /**
   * Returns the serialized metadata
   */
  parse(fieldName: string): PropertyMetadata {
    return {
      fieldName,
      dataType: this.dataType,
      nullable: false,
      searchable: this.#searchable,
      defaultValue: this.#defaultValue,
      indexes: this.#indexes,
      relationships: this.#relationships,
    }
  }
}
