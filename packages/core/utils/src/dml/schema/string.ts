import { SchemaMetadata } from "../types"
import { BaseSchema } from "./base"

export class StringSchema extends BaseSchema<string> {
  protected dataType: SchemaMetadata["dataType"] = {
    name: "string",
  }
}
