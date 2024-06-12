import { SchemaMetadata } from "../types"
import { BaseSchema } from "./base"

/**
 * The EnumSchema is used to define a property with pre-defined
 * list of choices.
 */
export class EnumSchema<
  const Values extends unknown
> extends BaseSchema<Values> {
  protected dataType: SchemaMetadata["dataType"] = {
    name: "enum",
  }

  constructor(values: Values[]) {
    super()
    this.dataType.options = { choices: values }
  }
}
