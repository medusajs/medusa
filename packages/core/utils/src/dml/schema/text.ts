import { SchemaMetadata } from "../types"
import { BaseSchema } from "./base"

/**
 * The NumberSchema is used to define a textual property
 */
export class TextSchema extends BaseSchema<string> {
  protected dataType: SchemaMetadata["dataType"] = {
    name: "text",
  }
}
