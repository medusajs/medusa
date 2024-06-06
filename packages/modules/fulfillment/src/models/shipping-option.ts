import {
  createPsqlIndexStatementHelper,
  DALUtils,
  generateEntityId,
  Searchable,
  ShippingOptionPriceType,
} from "@medusajs/utils"

import { DAL } from "@medusajs/types"
import {
  BeforeCreate,
  Cascade,
  Collection,
  Entity,
  Enum,
  Filter,
  ManyToOne,
  OneToMany,
  OneToOne,
  OnInit,
  OptionalProps,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"
import Fulfillment from "./fulfillment"
import FulfillmentProvider from "./fulfillment-provider"
import ServiceZone from "./service-zone"
import ShippingOptionRule from "./shipping-option-rule"
import ShippingOptionType from "./shipping-option-type"
import ShippingProfile from "./shipping-profile"

type ShippingOptionOptionalProps = DAL.SoftDeletableEntityDateColumns

const DeletedAtIndex = createPsqlIndexStatementHelper({
  tableName: "shipping_option",
  columns: "deleted_at",
  where: "deleted_at IS NOT NULL",
})

const ServiceZoneIdIndex = createPsqlIndexStatementHelper({
  tableName: "shipping_option",
  columns: "service_zone_id",
  where: "deleted_at IS NULL",
})

const ShippingProfileIdIndex = createPsqlIndexStatementHelper({
  tableName: "shipping_option",
  columns: "shipping_profile_id",
  where: "deleted_at IS NULL",
})

const FulfillmentProviderIdIndex = createPsqlIndexStatementHelper({
  tableName: "shipping_option",
  columns: "provider_id",
  where: "deleted_at IS NULL",
})

const ShippingOptionTypeIdIndex = createPsqlIndexStatementHelper({
  tableName: "shipping_option",
  columns: "shipping_option_type_id",
  where: "deleted_at IS NULL",
})

@Entity()
@Filter(DALUtils.mikroOrmSoftDeletableFilterOptions)
export default class ShippingOption {
  [OptionalProps]?: ShippingOptionOptionalProps

  @PrimaryKey({ columnType: "text" })
  id: string

  @Searchable()
  @Property({ columnType: "text" })
  name: string

  @Enum({
    items: () => ShippingOptionPriceType,
    default: ShippingOptionPriceType.FLAT,
  })
  price_type: ShippingOptionPriceType

  @ManyToOne(() => ServiceZone, {
    type: "text",
    fieldName: "service_zone_id",
    mapToPk: true,
    onDelete: "cascade",
  })
  @ServiceZoneIdIndex.MikroORMIndex()
  service_zone_id: string

  @ManyToOne(() => ShippingProfile, {
    type: "text",
    fieldName: "shipping_profile_id",
    mapToPk: true,
    nullable: true,
    onDelete: "set null",
  })
  @ShippingProfileIdIndex.MikroORMIndex()
  shipping_profile_id: string | null

  @ManyToOne(() => FulfillmentProvider, {
    type: "text",
    fieldName: "provider_id",
    mapToPk: true,
    nullable: true,
  })
  @FulfillmentProviderIdIndex.MikroORMIndex()
  provider_id: string

  @Property({ columnType: "text", persist: false })
  @ShippingOptionTypeIdIndex.MikroORMIndex()
  shipping_option_type_id: string | null = null

  @Property({ columnType: "jsonb", nullable: true })
  data: Record<string, unknown> | null = null

  @Property({ columnType: "jsonb", nullable: true })
  metadata: Record<string, unknown> | null = null

  @ManyToOne(() => ServiceZone, { persist: false })
  service_zone: ServiceZone

  @ManyToOne(() => ShippingProfile, {
    persist: false,
  })
  shipping_profile: ShippingProfile | null

  @ManyToOne(() => FulfillmentProvider, {
    persist: false,
  })
  provider: FulfillmentProvider | null

  @OneToOne(() => ShippingOptionType, (so) => so.shipping_option, {
    owner: true,
    cascade: [Cascade.PERSIST, "soft-remove"] as any,
    orphanRemoval: true,
    fieldName: "shipping_option_type_id",
    onDelete: "cascade",
  })
  type: ShippingOptionType

  @OneToMany(() => ShippingOptionRule, "shipping_option", {
    cascade: [Cascade.PERSIST, "soft-remove"] as any,
    orphanRemoval: true,
  })
  rules = new Collection<ShippingOptionRule>(this)

  @OneToMany(() => Fulfillment, (fulfillment) => fulfillment.shipping_option)
  fulfillments = new Collection<Fulfillment>(this)

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
    this.id = generateEntityId(this.id, "so")
    this.shipping_option_type_id ??= this.type?.id
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "so")
    this.shipping_option_type_id ??= this.type?.id
  }
}
