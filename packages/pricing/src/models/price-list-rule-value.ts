import {
  BeforeCreate,
  Entity,
  ManyToOne,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"

import PriceListRule from "./price-list-rule"
import { generateEntityId } from "@medusajs/utils"

@Entity()
export default class PriceListRuleValue {
  @PrimaryKey({ columnType: "text" })
  id!: string

  @ManyToOne(() => PriceListRule, {
    onDelete: "cascade",
    fieldName: 'price_list_rule_id',
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
