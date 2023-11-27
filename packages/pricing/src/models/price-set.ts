import { generateEntityId } from "@medusajs/utils"
import {
  BeforeCreate,
  Cascade,
  Collection,
  Entity,
  ManyToMany,
  OneToMany,
  OptionalProps,
  PrimaryKey,
} from "@mikro-orm/core"

import MoneyAmount from "./money-amount"
import PriceRule from "./price-rule"
import PriceSetMoneyAmount from "./price-set-money-amount"
import PriceSetRuleType from "./price-set-rule-type"
import RuleType from "./rule-type"

@Entity()
export default class PriceSet {
  [OptionalProps]?: "price_set_money_amounts" | "rule_types" | "money_amounts"

  @PrimaryKey({ columnType: "text" })
  id!: string

  @OneToMany(() => PriceSetMoneyAmount, (psma) => psma.price_set, {
    cascade: [Cascade.REMOVE],
  })
  price_set_money_amounts = new Collection<PriceSetMoneyAmount>(this)

  @OneToMany(() => PriceRule, (pr) => pr.price_set, {
    cascade: [Cascade.REMOVE],
  })
  price_rules = new Collection<PriceRule>(this)

  @ManyToMany({
    entity: () => MoneyAmount,
    pivotEntity: () => PriceSetMoneyAmount,
  })
  money_amounts = new Collection<MoneyAmount>(this)

  @ManyToMany({
    entity: () => RuleType,
    pivotEntity: () => PriceSetRuleType,
    cascade: [Cascade.REMOVE],
  })
  rule_types = new Collection<RuleType>(this)

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "pset")
  }
}
