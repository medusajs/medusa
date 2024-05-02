import { DALUtils, generateEntityId } from "@medusajs/utils"
import {
  BeforeCreate,
  Entity,
  Filter,
  ManyToOne,
  OnInit,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"
import PromotionRule from "./promotion-rule"

@Entity({ tableName: "promotion_rule_value" })
@Filter(DALUtils.mikroOrmSoftDeletableFilterOptions)
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

  @Property({
    onCreate: () => new Date(),
    columnType: "timestamptz",
    defaultRaw: "now()",
  })
  created_at: Date

  @Property({
    onCreate: () => new Date(),
    onUpdate: () => new Date(),
    columnType: "timestamptz",
    defaultRaw: "now()",
  })
  updated_at: Date

  @Property({ columnType: "timestamptz", nullable: true })
  deleted_at: Date | null = null

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "prorulval")
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "prorulval")
  }
}
