import { DmlEntity } from "./entity"
import { TextSchema } from "./schema/text"
import { JSONSchema } from "./schema/json"
import { HasOne } from "./relations/has_one"
import { HasMany } from "./relations/has_many"
import { NumberSchema } from "./schema/number"
import { BooleanSchema } from "./schema/boolean"
import { DateTimeSchema } from "./schema/date_time"
import { ManyToMany } from "./relations/many_to_many"
import { RelationshipType, SchemaType } from "./types"
import { EnumSchema } from "./schema/enum"

export class EntityBuilder {
  define<
    Schema extends Record<string, SchemaType<any> | RelationshipType<any>>
  >(name: string, schema: Schema) {
    return new DmlEntity(name, schema)
  }

  text() {
    return new TextSchema()
  }

  boolean() {
    return new BooleanSchema()
  }

  number() {
    return new NumberSchema()
  }

  dateTime() {
    return new DateTimeSchema()
  }

  json() {
    return new JSONSchema()
  }

  enum<const Values extends unknown>(values: Values[]) {
    return new EnumSchema<Values>(values)
  }

  hasOne<T>(entityBuilder: T, options?: Record<string, any>) {
    return new HasOne<T>(entityBuilder, options || {})
  }

  hasMany<T>(entityBuilder: T, options?: Record<string, any>) {
    return new HasMany<T>(entityBuilder, options || {})
  }

  manyToMany<T>(entityBuilder: T, options?: Record<string, any>) {
    return new ManyToMany<T>(entityBuilder, options || {})
  }
}
