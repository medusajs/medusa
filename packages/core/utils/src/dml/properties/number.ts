import { BaseProperty } from "./base"

/**
 * The NumberProperty is used to define a numeric/integer
 * property
 */
export class NumberProperty extends BaseProperty<number> {
  protected dataType: {
    name: "number"
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
      name: "number",
      options: { primaryKey: false, ...options },
    }
  }
}
