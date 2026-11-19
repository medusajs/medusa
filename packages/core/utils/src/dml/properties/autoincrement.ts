import { BaseProperty } from "./base"
import { PrimaryKeyModifier } from "./primary-key"

/**
 * The AutoIncrementProperty is used to define a serial
 * property
 */
export class AutoIncrementProperty extends BaseProperty<number> {
  protected dataType: {
    name: "serial"
    options: {
      searchable?: boolean
      primaryKey?: boolean
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
   *   id: model.autoincrement().primaryKey(),
   *   // ...
   * })
   *
   * export default Product
   *
   * @customNamespace Property Configuration Methods
   */
  primaryKey() {
    return new PrimaryKeyModifier<number, AutoIncrementProperty>(this)
  }

  /**
   * This method indicates that a serial property is searchable.
   * See [Define a Searchable Property](https://docs.medusajs.com/learn/fundamentals/data-models/properties#define-a-searchable-property) for more information.
   *
   * @example
   * import { model } from "@medusajs/framework/utils"
   *
   * const MyCustom = model.define("my_custom", {
   *   name: model.autoincrement().searchable(),
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
      name: "serial",
      options: { ...options },
    }
  }
}
