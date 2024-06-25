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

  primaryKey() {
    this.dataType.options.primaryKey = true

    return this
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
