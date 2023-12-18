import { generateEntityId } from "@medusajs/utils"
import {
  BeforeCreate,
  Collection,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryKey,
  PrimaryKeyType,
  Property,
} from "@mikro-orm/core"

import MoneyAmount from "./money-amount"
import PriceList from "./price-list"
import PriceRule from "./price-rule"
import PriceSet from "./price-set"
import PriceSetMoneyAmountRules from "./price-set-money-amount-rules"

@Entity()
export default class PriceSetMoneyAmount {
  @PrimaryKey({ columnType: "text" })
  id!: string

  @Property({ columnType: "text" })
  title!: string

  @ManyToOne(() => PriceSet, {
    onDelete: "cascade",
    index: "IDX_price_set_money_amount_price_set_id",
  })
  price_set?: PriceSet

  @OneToOne(() => MoneyAmount, {
    onDelete: "cascade",
    index: "IDX_price_set_money_amount_money_amount_id",
  })
  money_amount?: MoneyAmount

  @Property({ columnType: "integer", default: 0 })
  rules_count?: number

  @OneToMany({
    entity: () => PriceRule,
    mappedBy: (pr) => pr.price_set_money_amount,
  })
  price_rules = new Collection<PriceRule>(this)

  @OneToMany({
    entity: () => PriceSetMoneyAmountRules,
    mappedBy: (psmar) => psmar.price_set_money_amount,
  })
  price_set_money_amount_rules = new Collection<PriceSetMoneyAmountRules>(this)

  @ManyToOne(() => PriceList, {
    index: "IDX_price_rule_price_list_id",
    onDelete: "cascade",
    nullable: true,
  })
  price_list?: PriceList

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
