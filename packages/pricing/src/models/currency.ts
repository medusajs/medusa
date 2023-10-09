import { Entity, PrimaryKey, Property } from "@mikro-orm/core"

@Entity({ tableName: "currency" })
class Currency {
  @PrimaryKey({ columnType: "text" })
  code!: string

  @Property({ columnType: "text" })
  symbol: string

  @Property({ columnType: "text" })
  symbol_native: string

  @Property({ columnType: "text" })
  name: string

  // TODO: This is added here to make the schema compatible
  // with the core. Remove this when core is no longer running migrations
  @Property({ columnType: "boolean", nullable: true })
  includes_tax?: boolean
}

export default Currency
