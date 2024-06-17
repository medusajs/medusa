import { SchemaMetadata } from "../types"
import { BaseSchema } from "./base"

/**
 * The JSONSchema is used to define a property that stores
 * data as a JSON string
 */
export class JSONSchema extends BaseSchema<string> {
  protected dataType: SchemaMetadata["dataType"] = {
    name: "json",
  }
}
