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
import PriceList from "./price-list"

type OptionalFields = "id" | "priority" 
type OptionalRelations = "rule_type" | "price_list"

@Entity()
export default class PriceListRule {
  [OptionalProps]: OptionalFields | OptionalRelations

  @PrimaryKey({ columnType: "text" })
  id!: string

  @ManyToOne({
    entity: () => RuleType,
    fieldName: "rule_type_id",
    name: "price_rule_rule_type_id_unique",
    index: "IDX_price_list_rule_rule_type_id",
  })
  rule_type: RuleType

  @Property({ columnType: "text" })
  value: string

  @Property({ columnType: "integer", default: 0 })
  priority: number

  @ManyToOne({ 
    entity: () => PriceList,
    fieldName: "price_list_id",
    name: "price_rule_price_list_id",
    index: "IDX_price_list_rule_price_list_id",
  })
  price_list: PriceList

  @BeforeCreate()
  beforeCreate() {
    this.id = generateEntityId(this.id, "prule")
  }
}
