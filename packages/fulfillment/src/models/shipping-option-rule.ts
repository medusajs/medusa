import {
  createPsqlIndexStatementHelper,
  DALUtils,
  generateEntityId,
} from "@medusajs/utils"

import { DAL } from "@medusajs/types"
import {
  BeforeCreate,
  Entity,
  Filter,
  Index,
  ManyToOne,
  OnInit,
  OptionalProps,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"
import ShippingOption from "./shipping-option"

type ShippingOptionRuleOptionalProps = DAL.SoftDeletableEntityDateColumns

// TODO: need some test to see if we continue with this kind of structure or we change it
// More adjustments can appear as I move forward

const deletedAtIndexName = "IDX_shipping_option_rule_deleted_at"
const deletedAtIndexStatement = createPsqlIndexStatementHelper({
  name: deletedAtIndexName,
  tableName: "shipping_option_rule",
  columns: "deleted_at",
  where: "deleted_at IS NOT NULL",
}).expression

const shippingOptionIdIndexName = "IDX_shipping_option_rule_shipping_option_id"
const shippingOptionIdIndexStatement = createPsqlIndexStatementHelper({
  name: shippingOptionIdIndexName,
  tableName: "shipping_option_rule",
  columns: "shipping_option_id",
  where: "deleted_at IS NULL",
})

@Entity()
@Filter(DALUtils.mikroOrmSoftDeletableFilterOptions)
export default class ShippingOptionRule {
  [OptionalProps]?: ShippingOptionRuleOptionalProps

  @PrimaryKey({ columnType: "text" })
  id: string

  @Property({ columnType: "text" })
  attribute: string

  @Property({ columnType: "text" })
  operator: string

  @Property({ columnType: "jsonb", nullable: true })
  value: { value: string | string[] } | null = null

  @Property({ columnType: "text" })
  @Index({
    name: shippingOptionIdIndexName,
    expression: shippingOptionIdIndexStatement,
  })
  shipping_option_id: string

  @ManyToOne(() => ShippingOption, { persist: false })
  shipping_option: ShippingOption

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

  @Index({
    name: deletedAtIndexName,
    expression: deletedAtIndexStatement,
  })
  @Property({ columnType: "timestamptz", nullable: true })
  deleted_at: Date | null = null

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "sorul")
    this.shipping_option_id ??= this.shipping_option?.id
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "sorul")
    this.shipping_option_id ??= this.shipping_option?.id
  }
}
