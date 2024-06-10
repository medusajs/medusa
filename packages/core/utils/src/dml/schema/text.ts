import { SchemaMetadata } from "../types"
import { BaseSchema } from "./base"

export class TextSchema extends BaseSchema<string> {
  protected dataType: SchemaMetadata["dataType"] = {
    name: "string",
  }
}
