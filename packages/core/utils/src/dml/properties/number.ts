import { BaseProperty } from "./base"
import { PrimaryKeyModifier } from "./primary-key"

/**
 * The NumberProperty is used to define a numeric/integer
 * property
 */
export class NumberProperty extends BaseProperty<number> {
  protected dataType: {
    name: "number"
    options: {}
  }

  primaryKey() {
    return new PrimaryKeyModifier<number, NumberProperty>(this)
  }

  constructor(options?: { primaryKey?: boolean }) {
    super()

    this.dataType = {
      name: "number",
      options: { ...options },
    }
  }
}
