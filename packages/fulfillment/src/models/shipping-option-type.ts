import { DALUtils, generateEntityId } from "@medusajs/utils"

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

type ShippingOptionTypeOptionalProps = DAL.EntityDateColumns

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

  @Index({ name: "IDX_shipping_option_type_deleted_at" })
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
