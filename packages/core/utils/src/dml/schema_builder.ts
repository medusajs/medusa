import { BaseSchema } from "./schema/base"
import { StringSchema } from "./schema/string"

export class SchemaBuilder {
  string() {
    return new StringSchema()
  }
}
