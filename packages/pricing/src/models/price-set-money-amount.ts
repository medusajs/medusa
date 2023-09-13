import { generateEntityId } from "@medusajs/utils"
import {
  BeforeCreate,
  Entity,
  ManyToOne,
  PrimaryKey,
  PrimaryKeyType,
  Property,
} from "@mikro-orm/core"

import MoneyAmount from "./money-amount"
import PriceSet from "./price-set"

@Entity()
export default class PriceSetMoneyAmount {
  @PrimaryKey({ columnType: "text" })
  id!: string

  @Property({ columnType: "text" })
  title!: string

  @ManyToOne(() => PriceSet, { onDelete: "cascade" })
  price_set?: PriceSet

  @ManyToOne(() => MoneyAmount, {})
  money_amount?: MoneyAmount

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "psma")
  }

  [PrimaryKeyType]?: [string, string]

  constructor(money_amount: MoneyAmount, price_set: PriceSet) {
    this.money_amount = money_amount
    this.price_set = price_set
  }
}
