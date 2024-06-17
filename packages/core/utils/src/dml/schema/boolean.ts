import { SchemaMetadata } from "../types"
import { BaseSchema } from "./base"

/**
 * The BooleanSchema class is used to define a boolean
 * property
 */
export class BooleanSchema extends BaseSchema<boolean> {
  protected dataType: SchemaMetadata["dataType"] = {
    name: "boolean",
  }
}
