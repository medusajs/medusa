import { BaseProperty } from "./base"

/**
 * The Id property defines a unique identifier for the schema.
 * Most of the times it will be the primary as well.
 */
export class IdProperty extends BaseProperty<string> {
  protected dataType: {
    name: "id"
    options: {
      primaryKey: boolean
      prefix?: string
    }
  } = {
    name: "id",
    options: { primaryKey: false },
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
   * // With a custom prefix
   * const Product = model.define("Product", {
   *   id: model.id().primaryKey('idx_product_id'),
   *   // ...
   * })
   *
   * export default Product
   *
   * @customNamespace Property Configuration Methods
   */
  primaryKey(prefix?: string) {
    this.dataType.options.primaryKey = true
    this.dataType.options.prefix = prefix
    return this
  }
}
