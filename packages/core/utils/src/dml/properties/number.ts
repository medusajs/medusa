import { BaseProperty } from "./base"
import { PrimaryKeyModifier } from "./primary-key"

/**
 * The NumberProperty is used to define a numeric/integer
 * property
 */
export class NumberProperty extends BaseProperty<number> {
  protected dataType: {
    name: "number"
    options: {
      primaryKey?: boolean
      searchable?: boolean
    }
  }

  /**
   * This method indicates that the property is the data model's primary key.
   * See [Set Primary Key Property](https://docs.medusajs.com/learn/fundamentals/data-models/properties#set-primary-key-property) for more information.
   *
   * @example
   * import { model } from "@medusajs/framework/utils"
   *
   * const Product = model.define("Product", {
   *   code: model.number().primaryKey(),
   *   // ...
   * })
   *
   * export default Product
   *
   * @customNamespace Property Configuration Methods
   */
  primaryKey() {
    return new PrimaryKeyModifier<number, NumberProperty>(this)
  }

  /**
   * This method indicates that a number property is searchable.
   * See [Define a Searchable Property](https://docs.medusajs.com/learn/fundamentals/data-models/properties#define-a-searchable-property) for more information.
   *
   * @example
   * import { model } from "@medusajs/framework/utils"
   *
   * const MyCustom = model.define("my_custom", {
   *   name: model.number().searchable(),
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

  constructor(options?: { primaryKey?: boolean }) {
    super()

    this.dataType = {
      name: "number",
      options: { ...options },
    }
  }
}
