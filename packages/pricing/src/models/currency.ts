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

  // @Property({ persist: false })
  // get includes_tax() {
  //   // TODO: This comes from a feature flag
  //   // Figure out how we're handling FF in modules
  //   // For now, returning default as true
  //   // This should also not fall on the hands of the model
  //   return true
  // }
}

export default Currency
