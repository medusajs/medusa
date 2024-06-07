import { SchemaBuilder } from "./schema_builder"
import { HasOneRelation } from "./relations/has_one"

export class EntityBuilder<Schema extends Record<string, unknown>> {
  constructor(public schema: Schema) {}

  static define<Schema extends Record<string, unknown>>(schema: Schema) {
    return new EntityBuilder(schema)
  }

  static hasOne<T>(builder: T) {
    return new HasOneRelation<T>(builder)
  }

  static string() {
    return new SchemaBuilder().string()
  }
}

const profile = EntityBuilder.define({
  ghUsername: EntityBuilder.string(),
  user: EntityBuilder.hasOne(() => user),
})

const user = EntityBuilder.define({
  username: EntityBuilder.string(),
  profile: EntityBuilder.hasOne(() => profile),
})

user.schema.profile
