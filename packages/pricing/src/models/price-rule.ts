import {
  BeforeCreate,
  Entity,
  ManyToOne,
  OptionalProps,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"

import { generateEntityId } from "@medusajs/utils"
import PriceSet from "./price-set"
import PriceSetMoneyAmount from "./price-set-money-amount"
import RuleType from "./rule-type"

type OptionalFields = "id" | "is_dynamic" | "priority"
type OptionalRelations = "price_set" | "rule_type" | "price_set_money_amount"

@Entity()
export default class PriceRule {
  [OptionalProps]: OptionalFields | OptionalRelations

  @PrimaryKey({ columnType: "text" })
  id!: string

  @ManyToOne({
    entity: () => PriceSet,
    fieldName: "price_set_id",
    name: "price_rule_price_set_id_unique",
    onDelete: "cascade",
    index: "IDX_price_rule_price_set_id",
  })
  price_set: PriceSet

  @ManyToOne({
    entity: () => RuleType,
    fieldName: "rule_type_id",
    name: "price_rule_rule_type_id_unique",
    index: "IDX_price_rule_rule_type_id",
  })
  rule_type: RuleType

  @Property({ columnType: "text" })
  value: string

  @Property({ columnType: "integer", default: 0 })
  priority: number

  @ManyToOne({
    onDelete: "cascade",
    entity: () => PriceSetMoneyAmount,
    fieldName: "price_set_money_amount_id",
    name: "price_set_money_amount_id_unique",
    index: "IDX_price_rule_price_set_money_amount_id",
  })
  price_set_money_amount: PriceSetMoneyAmount

  @BeforeCreate()
  beforeCreate() {
    this.id = generateEntityId(this.id, "prule")
  }
}
