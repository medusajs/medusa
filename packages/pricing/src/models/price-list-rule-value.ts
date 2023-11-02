import {
  BeforeCreate,
  Entity,
  ManyToOne,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"

import { generateEntityId } from "@medusajs/utils"
import PriceListRule from "./price-list-rule"

@Entity()
export default class PriceListRuleValue {
  @PrimaryKey({ columnType: "text" })
  id!: string

  @ManyToOne(() => PriceListRule, {
    onDelete: "cascade",
    index: "IDX_price_list_rule_price_list_rule_value_id",
  })
  price_list_rule: PriceListRule

  @Property({ columnType: "text" })
  value: string

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "plrv")
  }
}
