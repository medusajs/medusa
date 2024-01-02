import {
  BeforeCreate,
  Entity,
  ManyToOne,
  OnInit,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"

import { generateEntityId } from "@medusajs/utils"
import PromotionRule from "./promotion-rule"

@Entity()
export default class PromotionRuleValue {
  @PrimaryKey({ columnType: "text" })
  id!: string

  @ManyToOne(() => PromotionRule, {
    onDelete: "cascade",
    fieldName: "promotion_rule_id",
    index: "IDX_promotion_rule_promotion_rule_value_id",
  })
  promotion_rule: PromotionRule

  @Property({ columnType: "text" })
  value: string

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "prorulval")
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "prorulval")
  }
}
