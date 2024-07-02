import { BaseProperty } from "./base"
import { PrimaryKeyModifier } from "./primary-key"

/**
 * The TextProperty is used to define a textual property
 */
export class TextProperty extends BaseProperty<string> {
  protected dataType: {
    name: "text"
    options: {
      primaryKey: boolean
      prefix?: string
      searchable: boolean
    }
  } = {
    name: "text",
    options: {
      primaryKey: false,
      searchable: false,
    },
  }

  /**
   * This method indicates that the property is the data model's primary key.
   *
   * @example
   * import { model } from "@medusajs/utils"
   *
   * const Product = model.define("Product", {
   *   code: model.text().primaryKey(),
   *   // ...
   * })
   *
   * export default Product
   *
   * @customNamespace Property Configuration Methods
   */
  primaryKey() {
    return new PrimaryKeyModifier<string, TextProperty>(this)
  }

  /**
   * This method indicates that a text property is searchable.
   *
   * @example
   * import { model } from "@medusajs/utils"
   *
   * const MyCustom = model.define("my_custom", {
   *   name: model.text().searchable(),
   *   // ...
   * })
   *
   * export default MyCustom
   *
   * @customNamespace Property Configuration Methods
   */
  searchable() {
    this.dataType.options.searchable = true

    return this
  }
}
