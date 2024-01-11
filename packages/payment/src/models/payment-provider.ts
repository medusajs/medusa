import { Entity, PrimaryKey, Property } from "@mikro-orm/core"

@Entity({ tableName: "payment-provider" })
export default class PaymentProvider {
  @PrimaryKey({ columnType: "text" })
  id: string

  @Property({
    default: true,
  })
  is_enabled: boolean = true
}
