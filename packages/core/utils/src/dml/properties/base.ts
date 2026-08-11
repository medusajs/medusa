import { PropertyMetadata, PropertyType } from "@medusajs/types"
import { BaseSchemaProperty } from "../../schema"
import { ComputedProperty } from "./computed"
import { NullableModifier } from "./nullable"

/**
 * The BaseProperty class offers shared affordances to define
 * property classes for DML entities. Extends the shared schema
 * base with DML-specific index / unique / computed modifiers.
 */
export abstract class BaseProperty<T>
  extends BaseSchemaProperty<T>
  implements PropertyType<T>
{
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
   * This method indicates that a property's value can be `null`.
   *
   * @example
   * import { model } from "@medusajs/framework/utils"
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
   * This method indicated that the property is a computed property.
   * Computed properties are not stored in the database but are
   * computed on the fly.
   *
   * @example
   * import { model } from "@medusajs/framework/utils"
   *
   * const MyCustom = model.define("my_custom", {
   *  calculated_price: model.bigNumber().computed(),
   *  // ...
   * })
   *
   * export default MyCustom
   *
   * @customNamespace Property Configuration Methods
   */
  computed() {
    return new ComputedProperty<T | null, this>(this)
  }

  /**
   * This method defines an index on a property.
   *
   * @param {string} name - The index's name. If not provided,
   * Medusa generates the name.
   *
   * @example
   * import { model } from "@medusajs/framework/utils"
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
   * import { model } from "@medusajs/framework/utils"
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
   * import { model } from "@medusajs/framework/utils"
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
    const base = super.parse(fieldName)
    return {
      ...base,
      dataType: this.dataType,
      defaultValue: this.#defaultValue,
      indexes: this.#indexes,
      relationships: this.#relationships,
    }
  }
}
