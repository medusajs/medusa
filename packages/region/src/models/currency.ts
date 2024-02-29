import { Entity, PrimaryKey, Property } from "@mikro-orm/core"

@Entity({ tableName: "region_currency" })
export default class Currency {
  @PrimaryKey({ columnType: "text" })
  code: string

  @Property({ columnType: "text" })
  symbol: string

  @Property({ columnType: "text" })
  symbol_native: string

  @Property({ columnType: "text" })
  name: string
}
