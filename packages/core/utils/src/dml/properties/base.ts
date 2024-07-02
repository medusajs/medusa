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
   * This method indicates that a property's value can be `null`.
   * 
   * @example
   * import { model } from "@medusajs/utils"
   * 
   * const MyCustom = model.define("my_custom", {
   *   price: model.bigNumber().nullable(),
   *   // ...
   * })
   * 
   * export default MyCustom
   * 
   * @customNamespace Property Configuration Methods
   */
  nullable() {
    return new NullableModifier<T, this>(this)
  }

  /**
   * This method defines an index on a property.
   * 
   * @param {string} name - The index's name. If not provided,
   * Medusa generates the name.
   * 
   * @example
   * import { model } from "@medusajs/utils"
   * 
   * const MyCustom = model.define("my_custom", {
   *   id: model.id(),
   *   name: model.text().index(
   *     "IDX_MY_CUSTOM_NAME"
   *   ),
   * })
   * 
   * export default MyCustom
   * 
   * @customNamespace Property Configuration Methods
   */
  index(name?: string) {
    this.#indexes.push({ name, type: "index" })
    return this
  }

  /**
   * This method indicates that a property's value must be unique in the database.
   * A unique index is created on the property.
   * 
   * @param {string} name - The unique index's name. If not provided,
   * Medusa generates the name.
   * 
   * @example
   * import { model } from "@medusajs/utils"
   * 
   * const User = model.define("user", {
   *   email: model.text().unique(),
   *   // ...
   * })
   * 
   * export default User
   * 
   * @customNamespace Property Configuration Methods
   */
  unique(name?: string) {
    this.#indexes.push({ name, type: "unique" })
    return this
  }

  /**
   * This method defines the default value of a property.
   * 
   * @param {T} value - The default value.
   * 
   * @example
   * import { model } from "@medusajs/utils"
   * 
   * const MyCustom = model.define("my_custom", {
   *   color: model
   *     .enum(["black", "white"])
   *     .default("black"),
   *   age: model
   *     .number()
   *     .default(0),
   *   // ...
   * })
   * 
   * export default MyCustom
   * 
   * @customNamespace Property Configuration Methods
   */
  default(value: T) {
    this.#defaultValue = value
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
      defaultValue: this.#defaultValue,
      indexes: this.#indexes,
      relationships: this.#relationships,
    }
  }
}
