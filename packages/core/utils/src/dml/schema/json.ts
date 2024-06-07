import { SchemaMetaData } from "../types"
import { BaseSchema } from "./base"

export class JSONSchema extends BaseSchema<string> {
  protected dataType: SchemaMetaData["dataType"] = {
    name: "json",
  }
}
