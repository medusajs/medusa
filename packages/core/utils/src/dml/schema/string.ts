import { SchemaMetaData } from "../types"
import { BaseSchema } from "./base"

export class StringSchema extends BaseSchema<string> {
  protected dataType: SchemaMetaData["dataType"] = {
    name: "string",
  }
}
