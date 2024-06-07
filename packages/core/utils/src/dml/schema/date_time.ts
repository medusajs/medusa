import { SchemaMetaData } from "../types"
import { BaseSchema } from "./base"

export class DateTimeSchema extends BaseSchema<Date> {
  protected dataType: SchemaMetaData["dataType"] = {
    name: "dateTime",
  }
}
