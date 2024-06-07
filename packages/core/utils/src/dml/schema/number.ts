import { SchemaMetaData } from "../types"
import { BaseSchema } from "./base"

export class NumberSchema extends BaseSchema<number> {
  protected dataType: SchemaMetaData["dataType"] = {
    name: "number",
  }
}
