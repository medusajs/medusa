import { generateEntityId } from "@medusajs/utils"
import {
  BeforeCreate,
  Collection,
  Entity,
  ManyToMany,
  OneToMany,
  OptionalProps,
  PrimaryKey,
} from "@mikro-orm/core"

import MoneyAmount from "./money-amount"
import PriceSetMoneyAmount from "./price-set-money-amount"

@Entity()
export default class PriceSet {
  [OptionalProps]?: "price_set_money_amounts"

  @PrimaryKey({ columnType: "text" })
  id!: string

  @OneToMany(() => PriceSetMoneyAmount, (psma) => psma.price_set)
  price_set_money_amounts = new Collection<PriceSetMoneyAmount>(this)

  @ManyToMany({
    entity: () => MoneyAmount,
    pivotEntity: () => PriceSetMoneyAmount,
  })
  money_amounts = new Collection<MoneyAmount>(this)

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "pset")
  }
}
