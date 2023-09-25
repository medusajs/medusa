import { generateEntityId } from "@medusajs/utils"
import {
  BeforeCreate,
  Collection,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  PrimaryKeyType,
  Property,
} from "@mikro-orm/core"

import MoneyAmount from "./money-amount"
import PriceRule from "./price-rule"
import PriceSet from "./price-set"
import PriceSetMoneyAmountRules from "./price-set-money-amount-rules"
import RuleType from "./rule-type"

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

  @ManyToOne(() => MoneyAmount, {
    index: "IDX_price_set_money_amount_money_amount_id",
  })
  money_amount?: MoneyAmount

  @Property({ columnType: "numeric", default: 0 })
  number_rules?: string

  @OneToMany({
    entity: () => PriceRule,
    mappedBy: (ps) => ps.price_set_money_amount,
  })
  price_rules = new Collection<PriceRule>(this)

  @OneToMany({
    entity: () => PriceSetMoneyAmountRules,
    mappedBy: (ps) => ps.price_set_money_amount,
  })
  price_set_money_amount_rules = new Collection<PriceSetMoneyAmountRules>(this)

  @ManyToMany({
    entity: () => RuleType,
    pivotEntity: () => PriceRule,
    nullable: true,
  })
  rule_types = new Collection<RuleType>(this)

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
