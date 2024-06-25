import { BaseProperty } from "./base"

/**
 * The TextProperty is used to define a textual property
 */
export class TextProperty extends BaseProperty<string> {
  protected dataType: {
    name: "text"
    options: {
      primaryKey: boolean
    }
  }

  primaryKey() {
    this.dataType.options.primaryKey = true

    return this
  }

  constructor(options?: { primaryKey?: boolean }) {
    super()

    this.dataType = {
      name: "text",
      options: { primaryKey: false, ...options },
    }
  }
}
