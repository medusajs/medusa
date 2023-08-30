import { generateEntityId } from "@medusajs/utils"
import {
  BeforeCreate,
  Entity,
  ManyToOne,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"

import Currency from "./currency"

@Entity()
class MoneyAmount {
  @PrimaryKey({ columnType: "text" })
  id!: string

  @Property({ columnType: "text", nullable: true })
  currency_code!: string

  @ManyToOne(() => Currency, {
    nullable: true,
    index: "IDX_money_amount_currency_code",
    fieldName: "currency_code",
  })
  currency?: Currency

  @Property({ columnType: "numeric", nullable: true })
  amount?: number

  @Property({ columnType: "numeric", nullable: true })
  min_quantity?: number | null

  @Property({ columnType: "numeric", nullable: true })
  max_quantity?: number | null

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "ma")
  }
}

export default MoneyAmount
