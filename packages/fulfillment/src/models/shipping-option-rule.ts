import { DALUtils, generateEntityId } from "@medusajs/utils"

import {
  BeforeCreate,
  Entity,
  Filter,
  Index,
  OnInit,
  OptionalProps,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"
import { DAL } from "@medusajs/types"

type ShippingOptionRuleOptionalProps = DAL.EntityDateColumns

// TODO: need some test to see if we continue with this kind of structure or we change it

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

  shipping_options // TODO: configure relationship

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

  @Index({ name: "IDX_shipping_option_rule_deleted_at" })
  @Property({ columnType: "timestamptz", nullable: true })
  deleted_at: Date | null = null

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "shoptty")
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "shoptty")
  }
}
