import { SchemaMetadata } from "../types"
import { BaseSchema } from "./base"

export class DateTimeSchema extends BaseSchema<Date> {
  protected dataType: SchemaMetadata["dataType"] = {
    name: "dateTime",
  }
}
