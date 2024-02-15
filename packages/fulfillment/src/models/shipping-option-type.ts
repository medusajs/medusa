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
  OneToOne,
  OnInit,
  OptionalProps,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"
import { DAL } from "@medusajs/types"
import ShippingOption from "./shipping-option"

type ShippingOptionTypeOptionalProps = DAL.SoftDeletableEntityDateColumns

const deletedAtIndexName = "IDX_shipping_option_type_deleted_at"
const deletedAtIndexStatement = createPsqlIndexStatementHelper({
  name: deletedAtIndexName,
  tableName: "shipping_option_type",
  columns: "deleted_at",
  where: "deleted_at IS NOT NULL",
})

const shippingOptionIdIndexName = "IDX_shipping_option_type_shipping_option_id"
const shippingOptionIdIndexStatement = createPsqlIndexStatementHelper({
  name: shippingOptionIdIndexName,
  tableName: "shipping_option_type",
  columns: "shipping_option_id",
  where: "deleted_at IS NULL",
})

@Entity()
@Filter(DALUtils.mikroOrmSoftDeletableFilterOptions)
export default class ShippingOptionType {
  [OptionalProps]?: ShippingOptionTypeOptionalProps

  @PrimaryKey({ columnType: "text" })
  id: string

  @Property({ columnType: "text" })
  label: string

  @Property({ columnType: "text", nullable: true })
  description: string | null = null

  @Property({ columnType: "text" })
  code: string

  @Property({ columnType: "text" })
  @Index({
    name: shippingOptionIdIndexName,
    expression: shippingOptionIdIndexStatement,
  })
  shipping_option_id: string

  @OneToOne(() => ShippingOption, (so) => so.shipping_option_type)
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
    this.id = generateEntityId(this.id, "sotype")
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "sotype")
  }
}
