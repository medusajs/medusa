import { BaseProperty } from "./base"

/**
 * The Id property defines a unique identifier for the schema.
 * Most of the times it will be the primary as well.
 */
export class IdProperty extends BaseProperty<string> {
  protected dataType: {
    name: "id"
    options: {
      primaryKey: boolean
      prefix?: string
    }
  }

  constructor(options?: { primaryKey?: boolean; prefix?: string }) {
    super()
    this.dataType = { name: "id", options: { primaryKey: true, ...options } }
  }
}
