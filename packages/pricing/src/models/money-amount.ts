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

  @ManyToOne(() => Currency)
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
