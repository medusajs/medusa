import {
  DALUtils,
  generateEntityId,
  ShippingOptionPriceType,
} from "@medusajs/utils"

import {
  BeforeCreate,
  Collection,
  Entity,
  Enum,
  Filter,
  Index,
  ManyToOne,
  OneToMany,
  OneToOne,
  OnInit,
  OptionalProps,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"
import { DAL } from "@medusajs/types"
import ServiceZone from "./service-zone"
import ShippingProfile from "./shipping-profile"
import ServiceProvider from "./service-provider"
import ShippingOptionType from "./shipping-option-type"
import ShippingOptionRule from "./shipping-option-rule"

type ShippingOptionOptionalProps = DAL.SoftDeletableEntityDateColumns

@Entity()
@Filter(DALUtils.mikroOrmSoftDeletableFilterOptions)
export default class ShippingOption {
  [OptionalProps]?: ShippingOptionOptionalProps

  @PrimaryKey({ columnType: "text" })
  id: string

  @Property({ columnType: "text" })
  name: string

  @Enum({
    items: () => ShippingOptionPriceType,
    default: ShippingOptionPriceType.CALCULATED,
  })
  price_type: ShippingOptionPriceType

  @Property({ columnType: "text" })
  service_zone_id: string

  @Property({ columnType: "text" })
  shipping_profile_id: string

  @Property({ columnType: "text" })
  service_provider_id: string

  @Property({ columnType: "text", nullable: true })
  shipping_option_type_id: string | null = null

  @Property({ columnType: "jsonb", nullable: true })
  data: Record<string, unknown> | null = null

  @Property({ columnType: "jsonb", nullable: true })
  metadata: Record<string, unknown> | null = null

  @ManyToOne(() => ServiceZone)
  service_zone: ServiceZone

  @ManyToOne(() => ShippingProfile)
  shipping_profile: ShippingProfile

  @ManyToOne(() => ServiceProvider)
  service_provider: ServiceProvider

  @OneToOne(() => ShippingOptionType, (so) => so.shipping_option, {
    owner: true,
  })
  shipping_option_type: ShippingOptionType

  @OneToMany(() => ShippingOptionRule, (sor) => sor.shipping_option)
  rules = new Collection<ShippingOptionRule>(this)

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
