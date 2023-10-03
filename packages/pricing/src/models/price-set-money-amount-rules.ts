import { generateEntityId } from "@medusajs/utils"
import {
  BeforeCreate,
  Entity,
  ManyToOne,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"

import PriceSetMoneyAmount from "./price-set-money-amount"
import RuleType from "./rule-type"

@Entity()
export default class PriceSetMoneyAmountRules {
  @PrimaryKey({ columnType: "text" })
  id!: string

  @ManyToOne(() => PriceSetMoneyAmount, {
    onDelete: "cascade",
    index: "IDX_price_set_money_amount_rules_price_set_money_amount_id",
  })
  price_set_money_amount?: PriceSetMoneyAmount | string

  @ManyToOne(() => RuleType, {
    index: "IDX_price_set_money_amount_rules_rule_type_id",
  })
  rule_type?: RuleType | string

  @Property({ columnType: "text" })
  value: string

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "psmar")
  }
}
