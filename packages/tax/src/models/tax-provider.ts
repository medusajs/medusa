import { Entity, OptionalProps, PrimaryKey, Property } from "@mikro-orm/core"

const TABLE_NAME = "tax_provider"
@Entity({ tableName: TABLE_NAME })
export default class TaxProvider {
  [OptionalProps]?: "is_enabled"

  @PrimaryKey({ columnType: "text" })
  id: string

  @Property({
    default: true,
    columnType: "boolean",
  })
  is_enabled: boolean = true
}
