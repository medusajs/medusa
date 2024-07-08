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
  OneToOne,
  OnInit,
  OptionalProps,
  PrimaryKey,
  Property,
  Rel,
} from "@mikro-orm/core"
import ShippingOption from "./shipping-option"

type ShippingOptionTypeOptionalProps = DAL.SoftDeletableModelDateColumns

const DeletedAtIndex = createPsqlIndexStatementHelper({
  tableName: "shipping_option_type",
  columns: "deleted_at",
  where: "deleted_at IS NOT NULL",
})

const ShippingOptionIdIndex = createPsqlIndexStatementHelper({
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

  @OneToOne(() => ShippingOption, (so) => so.type, {
    type: "text",
    onDelete: "cascade",
  })
  shipping_option: Rel<ShippingOption>

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

  @DeletedAtIndex.MikroORMIndex()
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
