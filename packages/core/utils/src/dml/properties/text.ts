import { BaseProperty } from "./base"

/**
 * The TextProperty is used to define a textual property
 */
export class TextProperty extends BaseProperty<string> {
  protected dataType: {
    name: "text"
    options: {
      primaryKey: boolean
      searchable: boolean
    }
  }

  /**
   * This method indicates that the property is the data model's primary key.
   * 
   * @example
   * import { model } from "@medusajs/utils"
   * 
   * const MyCustom = model.define("my_custom", {
   *   code: model.text().primaryKey(),
   *   // ...
   * })
   * 
   * export default MyCustom
   * 
   * @customNamespace Property Configuration Methods
   */
  primaryKey() {
    this.dataType.options.primaryKey = true

    return this
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

  constructor(options?: { primaryKey?: boolean; searchable?: boolean }) {
    super()

    this.dataType = {
      name: "text",
      options: { primaryKey: false, searchable: false, ...options },
    }
  }
}
