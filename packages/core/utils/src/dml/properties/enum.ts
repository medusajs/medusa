import { PropertyMetadata } from "../types"
import { BaseProperty } from "./base"

/**
 * The EnumProperty is used to define a property with pre-defined
 * list of choices.
 */
export class EnumProperty<
  const Values extends unknown
> extends BaseProperty<Values> {
  protected dataType: {
    name: "enum"
    options: { choices: Values[] }
  }

  constructor(values: Values[]) {
    super()
    this.dataType = { name: "enum", options: { choices: values } }
  }
}
