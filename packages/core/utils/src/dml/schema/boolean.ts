import { SchemaMetaData } from "../types"
import { BaseSchema } from "./base"

export class BooleanSchema extends BaseSchema<boolean> {
  protected dataType: SchemaMetaData["dataType"] = {
    name: "boolean",
  }
}
