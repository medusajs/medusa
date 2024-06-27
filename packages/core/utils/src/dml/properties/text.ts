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
      searchable: boolean
    }
  }

  primaryKey() {
    return new PrimaryKeyModifier<string, TextProperty>(this)
  }

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
