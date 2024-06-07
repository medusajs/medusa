import { SchemaMetadata } from "../types"
import { BaseSchema } from "./base"

export class JSONSchema extends BaseSchema<string> {
  protected dataType: SchemaMetadata["dataType"] = {
    name: "json",
  }
}
