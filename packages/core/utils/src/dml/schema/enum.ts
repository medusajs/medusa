import { SchemaMetaData } from "../types"
import { BaseSchema } from "./base"

export class EnumSchema<
  const Values extends unknown
> extends BaseSchema<Values> {
  protected dataType: SchemaMetaData["dataType"] = {
    name: "enum",
  }

  constructor(values: Values[]) {
    super()
    this.dataType.options = { choices: values }
  }
}
