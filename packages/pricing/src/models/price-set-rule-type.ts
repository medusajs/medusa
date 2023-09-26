import {
  BeforeCreate,
  Entity,
  ManyToOne,
  PrimaryKey,
  PrimaryKeyType,
} from "@mikro-orm/core"

import PriceSet from "./price-set"
import RuleType from "./rule-type"
import { generateEntityId } from "@medusajs/utils"

@Entity()
export default class PriceSetRuleType {
  @PrimaryKey({ columnType: "text" })
  id!: string

  @ManyToOne(() => PriceSet, {
    onDelete: "cascade",
    index: "IDX_price_set_rule_type_price_set_id",
  })
  price_set: PriceSet

  @ManyToOne(() => RuleType, {
    index: "IDX_price_set_rule_type_rule_type_id",
  })
  rule_type: RuleType

  // [PrimaryKeyType]?: [string, string]

  // constructor(price_set: PriceSet, rule_type: RuleType) {
  //   this.price_set = price_set
  //   this.rule_type = rule_type
  // }
  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "psrt")
  }
}
