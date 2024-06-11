import { SchemaMetadata } from "../types"
import { BaseSchema } from "./base"

export class BooleanSchema extends BaseSchema<boolean> {
  protected dataType: SchemaMetadata["dataType"] = {
    name: "boolean",
  }
}
