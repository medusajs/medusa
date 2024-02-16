import {
  createPsqlIndexStatementHelper,
  DALUtils,
  generateEntityId,
  ShippingOptionPriceType,
} from "@medusajs/utils"

import { DAL } from "@medusajs/types"
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
import Fulfillment from "./fulfillment"
import ServiceProvider from "./service-provider"
import ServiceZone from "./service-zone"
import ShippingOptionRule from "./shipping-option-rule"
import ShippingOptionType from "./shipping-option-type"
import ShippingProfile from "./shipping-profile"

type ShippingOptionOptionalProps = DAL.SoftDeletableEntityDateColumns

const deletedAtIndexName = "IDX_shipping_option_deleted_at"
const deletedAtIndexStatement = createPsqlIndexStatementHelper({
  name: deletedAtIndexName,
  tableName: "shipping_option",
  columns: "deleted_at",
  where: "deleted_at IS NOT NULL",
}).expression

const serviceZoneIdIndexName = "IDX_shipping_option_service_zone_id"
const serviceZoneIdIndexStatement = createPsqlIndexStatementHelper({
  name: serviceZoneIdIndexName,
  tableName: "shipping_option",
  columns: "service_zone_id",
  where: "deleted_at IS NULL",
}).expression

const shippingProfileIdIndexName = "IDX_shipping_option_shipping_profile_id"
const shippingProfileIdIndexStatement = createPsqlIndexStatementHelper({
  name: shippingProfileIdIndexName,
  tableName: "shipping_option",
  columns: "shipping_profile_id",
  where: "deleted_at IS NULL",
}).expression

const serviceProviderIdIndexName = "IDX_shipping_option_service_provider_id"
const serviceProviderIdIndexStatement = createPsqlIndexStatementHelper({
  name: serviceProviderIdIndexName,
  tableName: "shipping_option",
  columns: "service_provider_id",
  where: "deleted_at IS NULL",
}).expression

const shippingOptionTypeIdIndexName =
  "IDX_shipping_option_shipping_option_type_id"
const shippingOptionTypeIdIndexStatement = createPsqlIndexStatementHelper({
  name: shippingOptionTypeIdIndexName,
  tableName: "shipping_option",
  columns: "shipping_option_type_id",
  where: "deleted_at IS NULL",
}).expression

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
  @Index({
    name: serviceZoneIdIndexName,
    expression: serviceZoneIdIndexStatement,
  })
  service_zone_id: string

  @Property({ columnType: "text" })
  @Index({
    name: shippingProfileIdIndexName,
    expression: shippingProfileIdIndexStatement,
  })
  shipping_profile_id: string

  @Property({ columnType: "text" })
  @Index({
    name: serviceProviderIdIndexName,
    expression: serviceProviderIdIndexStatement,
  })
  service_provider_id: string

  @Property({ columnType: "text", nullable: true })
  @Index({
    name: shippingOptionTypeIdIndexName,
    expression: shippingOptionTypeIdIndexStatement,
  })
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

  @Index({
    name: deletedAtIndexName,
    expression: deletedAtIndexStatement,
  })
  @Property({ columnType: "timestamptz", nullable: true })
  deleted_at: Date | null = null

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "so")
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "so")
  }
}
