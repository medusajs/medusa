import { SchemaMetadata } from "../types"
import { BaseSchema } from "./base"

export class NumberSchema extends BaseSchema<number> {
  protected dataType: SchemaMetadata["dataType"] = {
    name: "number",
  }
}
