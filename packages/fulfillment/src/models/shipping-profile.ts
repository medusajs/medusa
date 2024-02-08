import { DALUtils, generateEntityId } from "@medusajs/utils"

import {
  BeforeCreate,
  Collection,
  Entity,
  Filter,
  Index,
  OneToMany,
  OnInit,
  OptionalProps,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"
import { DAL } from "@medusajs/types"
import ShippingOption from "./shipping-option"

type ShippingProfileOptionalProps = DAL.SoftDeletableEntityDateColumns

@Entity()
@Filter(DALUtils.mikroOrmSoftDeletableFilterOptions)
export default class ShippingProfile {
  [OptionalProps]?: ShippingProfileOptionalProps

  @PrimaryKey({ columnType: "text" })
  id: string

  @OneToMany(
    () => ShippingOption,
    (shippingOption) => shippingOption.shipping_profile
  )
  shipping_options = new Collection<ShippingOption>(this)

  @Property({ columnType: "jsonb", nullable: true })
  metadata: Record<string, unknown> | null = null

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

  @Index({ name: "IDX_shipping_profile_deleted_at" })
  @Property({ columnType: "timestamptz", nullable: true })
  deleted_at: Date | null = null

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "shpro")
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "shpro")
  }
}
