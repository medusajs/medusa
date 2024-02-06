import {
  DALUtils,
  generateEntityId,
  ShippingOptionPriceType,
} from "@medusajs/utils"

import {
  BeforeCreate,
  Entity,
  Enum,
  Filter,
  Index,
  OnInit,
  OptionalProps,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"
import { DAL } from "@medusajs/types"

type ShippingOptionOptionalProps = DAL.EntityDateColumns

@Entity()
@Filter(DALUtils.mikroOrmSoftDeletableFilterOptions)
export default class ShippingOption {
  [OptionalProps]?: ShippingOptionOptionalProps

  @PrimaryKey({ columnType: "text" })
  id: string

  rules // TODO configure relationship

  @Property({ columnType: "text" })
  name: string

  @Enum({
    items: () => ShippingOptionPriceType,
    default: ShippingOptionPriceType.CALCULATED,
  })
  price_type: ShippingOptionPriceType

  provider_id // TODO configure relationship

  @Property({ columnType: "jsonb", nullable: true })
  data: Record<string, unknown> | null = null

  @Property({ columnType: "text", nullable: true })
  shipping_option_type_id: string | null = null

  shipping_option_type // TODO configure relationship

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

  @Index({ name: "IDX_shipping_option_deleted_at" })
  @Property({ columnType: "timestamptz", nullable: true })
  deleted_at: Date | null = null

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "shopt")
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "shopt")
  }
}
