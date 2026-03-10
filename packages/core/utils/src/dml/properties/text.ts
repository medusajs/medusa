import { BaseProperty } from "./base"
import { PrimaryKeyModifier } from "./primary-key"

/**
 * The TextProperty is used to define a textual property
 */
export class TextProperty extends BaseProperty<string> {
  protected dataType: {
    name: "text"
    options: {
      prefix?: string
      searchable: boolean
      translatable?: boolean
    }
  } = {
    name: "text",
    options: {
      searchable: false,
    },
  }

  /**
   * This method indicates that the property is the data model's primary key.
   *
   * @example
   * import { model } from "@medusajs/framework/utils"
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
   * import { model } from "@medusajs/framework/utils"
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

  /**
   * This method indicates that a text property is translatable.
   * Translatable properties can have different values per locale.
   * See [Translate Custom Data Models](https://docs.medusajs.com/resources/commerce-modules/translation/custom-data-models) for more information.
   *
   * @example
   * import { model } from "@medusajs/framework/utils"
   *
   * const Store = model.define("store", {
   *   name: model.text().translatable(),
   *   // ...
   * })
   *
   * export default Store
   *
   * @customNamespace Property Configuration Methods
   * @since 2.13.0
   */
  translatable() {
    this.dataType.options.translatable = true
    return this
  }
}
