import { SchemaMetadata } from "../types"
import { BaseSchema } from "./base"

/**
 * The DateTimeSchema class is used to define a timestampz
 * property
 */
export class DateTimeSchema extends BaseSchema<Date> {
  protected dataType: SchemaMetadata["dataType"] = {
    name: "dateTime",
  }
}
