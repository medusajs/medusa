import {
  createPsqlIndexStatementHelper,
  DALUtils,
  generateEntityId,
} from "@medusajs/utils"

import { DAL } from "@medusajs/types"
import {
  BeforeCreate,
  Collection,
  Entity,
  Filter,
  Index,
  ManyToOne,
  OneToMany,
  OnInit,
  OptionalProps,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"
import Address from "./address"
import FulfillmentItem from "./fulfillment-item"
import FulfillmentLabel from "./fulfillment-label"
import ServiceProvider from "./service-provider"
import ShippingOption from "./shipping-option"

type FulfillmentOptionalProps = DAL.SoftDeletableEntityDateColumns

const fulfillmentDeletedAtIndexName = "IDX_fulfillment_deleted_at"
const fulfillmentDeletedAtIndexStatement = createPsqlIndexStatementHelper({
  name: fulfillmentDeletedAtIndexName,
  tableName: "fulfillment",
  columns: "deleted_at",
  where: "deleted_at IS NOT NULL",
}).expression

const fulfillmentProviderIdIndexName = "IDX_fulfillment_provider_id"
const fulfillmentProviderIdIndexStatement = createPsqlIndexStatementHelper({
  name: fulfillmentProviderIdIndexName,
  tableName: "fulfillment",
  columns: "provider_id",
  where: "deleted_at IS NULL",
}).expression

const fulfillmentLocationIdIndexName = "IDX_fulfillment_location_id"
const fulfillmentLocationIdIndexStatement = createPsqlIndexStatementHelper({
  name: fulfillmentLocationIdIndexName,
  tableName: "fulfillment",
  columns: "location_id",
  where: "deleted_at IS NULL",
}).expression

const fulfillmentShippingOptionIdIndexName =
  "IDX_fulfillment_shipping_option_id"
const fulfillmentShippingOptionIdIndexStatement =
  createPsqlIndexStatementHelper({
    name: fulfillmentShippingOptionIdIndexName,
    tableName: "fulfillment",
    columns: "shipping_option_id",
    where: "deleted_at IS NULL",
  }).expression

@Entity()
@Filter(DALUtils.mikroOrmSoftDeletableFilterOptions)
export default class Fulfillment {
  [OptionalProps]?: FulfillmentOptionalProps

  @PrimaryKey({ columnType: "text" })
  id: string

  @Property({ columnType: "text" })
  @Index({
    name: fulfillmentLocationIdIndexName,
    expression: fulfillmentLocationIdIndexStatement,
  })
  location_id: string

  @Property({
    columnType: "timestamptz",
    nullable: true,
  })
  packed_at: Date | null = null

  @Property({
    columnType: "timestamptz",
    nullable: true,
  })
  shipped_at: Date | null = null

  @Property({
    columnType: "timestamptz",
    nullable: true,
  })
  delivered_at: Date | null = null

  @Property({
    columnType: "timestamptz",
    nullable: true,
  })
  canceled_at: Date | null = null

  @Property({ columnType: "jsonb", nullable: true })
  data: Record<string, unknown> | null = null

  @Property({ columnType: "text" })
  @Index({
    name: fulfillmentProviderIdIndexName,
    expression: fulfillmentProviderIdIndexStatement,
  })
  provider_id: string

  @Property({ columnType: "text", nullable: true })
  @Index({
    name: fulfillmentShippingOptionIdIndexName,
    expression: fulfillmentShippingOptionIdIndexStatement,
  })
  shipping_option_id: string | null = null

  @Property({ columnType: "jsonb", nullable: true })
  metadata: Record<string, unknown> | null = null

  @ManyToOne(() => ShippingOption, { nullable: true })
  shipping_option: ShippingOption | null

  @ManyToOne(() => ServiceProvider)
  provider: ServiceProvider

  @ManyToOne(() => Address)
  delivery_address: Address

  @ManyToOne(() => FulfillmentItem)
  items: FulfillmentItem

  @OneToMany(() => FulfillmentLabel, (label) => label.fulfillment)
  labels = new Collection<FulfillmentLabel>(this)

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
    name: fulfillmentDeletedAtIndexName,
    expression: fulfillmentDeletedAtIndexStatement,
  })
  @Property({ columnType: "timestamptz", nullable: true })
  deleted_at: Date | null = null

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "ful")
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "ful")
  }
}
