import { SchemaMetadata } from "../types"
import { BaseSchema } from "./base"

/**
 * The NumberSchema is used to define a numeric/integer
 * property
 */
export class NumberSchema extends BaseSchema<number> {
  protected dataType: SchemaMetadata["dataType"] = {
    name: "number",
  }
}
