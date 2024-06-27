import { BaseProperty } from "./base"
import { PrimaryKeyModifier } from "./primary-key"

const IsIdProperty = Symbol("IsIdProperty")

/**
 * The Id property defines a unique identifier for the schema.
 * Most of the times it will be the primary as well.
 */
export class IdProperty extends BaseProperty<string> {
  [IsIdProperty] = true

  static isIdProperty(value: any): value is IdProperty {
    return !!value?.[IsIdProperty]
  }

  protected dataType: {
    name: "id"
    options: {
      prefix?: string
    }
  }

  constructor(options: { prefix?: string } = {}) {
    super()

    this.dataType = {
      name: "id",
      options,
    }
  }

  primaryKey(decision: boolean) {
    if (decision) {
      return new PrimaryKeyModifier<string, IdProperty>(this)
    }

    return this
  }
}
