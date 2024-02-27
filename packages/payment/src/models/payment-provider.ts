import { Entity, OptionalProps, PrimaryKey, Property } from "@mikro-orm/core"

@Entity({ tableName: "payment_provider" })
export default class PaymentProvider {
  [OptionalProps]?: "is_enabled"

  @PrimaryKey({ columnType: "text" })
  id: string

  @Property({
    default: true,
    columnType: "boolean",
  })
  is_enabled: boolean = true
}
