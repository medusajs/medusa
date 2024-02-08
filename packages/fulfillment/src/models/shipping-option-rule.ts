import {
  createPsqlIndexStatementHelper,
  DALUtils,
  generateEntityId,
} from "@medusajs/utils"

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
import { DAL } from "@medusajs/types"
import ShippingOption from "./shipping-option"

type ShippingOptionRuleOptionalProps = DAL.SoftDeletableEntityDateColumns

// TODO: need some test to see if we continue with this kind of structure or we change it

const deletedAtIndexName = "IDX_shipping_option_rule_deleted_at"
const deletedAtIndexStatement = createPsqlIndexStatementHelper({
  name: deletedAtIndexName,
  tableName: "shipping_option_rule",
  columns: "deleted_at",
  where: "deleted_at IS NOT NULL",
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
  shipping_option_id: string

  @ManyToOne(() => ShippingOption)
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
    this.id = generateEntityId(this.id, "shoptru")
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "shoptru")
  }
}
