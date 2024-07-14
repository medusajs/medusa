import { BaseProperty } from "./base"
import { PrimaryKeyModifier } from "./primary-key"

const IsIdProperty = Symbol("IsIdProperty")

/**
 * The Id property defines a unique identifier for the schema.
 * Most of the times it will be the primary as well.
 */
export class IdProperty extends BaseProperty<string> {
  [IsIdProperty] = true

  static isIdProperty(value: any): value is IdProperty {
    return !!value?.[IsIdProperty] || value?.dataType?.name === "id"
  }

  protected dataType: {
    name: "id"
    options: {
      prefix?: string
    }
  } = {
    name: "id",
    options: {},
  }

  constructor(options?: { prefix?: string }) {
    super()
    this.dataType.options.prefix = options?.prefix
  }

  /**
   * This method indicates that the property is the data model's primary key.
   *
   * @example
   * import { model } from "@medusajs/utils"
   *
   * const Product = model.define("Product", {
   *   id: model.id().primaryKey(),
   *   // ...
   * })
   *
   * export default Product
   *
   * @customNamespace Property Configuration Methods
   */
  primaryKey() {
    return new PrimaryKeyModifier<string, IdProperty>(this)
  }
}
