import {
  createPsqlIndexStatementHelper,
  DALUtils,
  generateEntityId,
} from "@medusajs/utils"

import { DAL } from "@medusajs/types"
import {
  BeforeCreate,
  Cascade,
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
import FulfillmentSet from "./fullfilment-set"
import GeoZone from "./geo-zone"
import ShippingOption from "./shipping-option"

type ServiceZoneOptionalProps = DAL.SoftDeletableEntityDateColumns

const deletedAtIndexName = "IDX_service_zone_deleted_at"
const deletedAtIndexStatement = createPsqlIndexStatementHelper({
  name: deletedAtIndexName,
  tableName: "service_zone",
  columns: "deleted_at",
  where: "deleted_at IS NOT NULL",
}).expression

const nameIndexName = "IDX_service_zone_name_unique"
const nameIndexStatement = createPsqlIndexStatementHelper({
  name: nameIndexName,
  tableName: "service_zone",
  columns: "name",
  unique: true,
  where: "deleted_at IS NULL",
})

const fulfillmentSetIdIndexName = "IDX_service_zone_fulfillment_set_id"
const fulfillmentSetIdIndexStatement = createPsqlIndexStatementHelper({
  name: fulfillmentSetIdIndexName,
  tableName: "service_zone",
  columns: "fulfillment_set_id",
  where: "deleted_at IS NULL",
})

@Entity()
@Filter(DALUtils.mikroOrmSoftDeletableFilterOptions)
export default class ServiceZone {
  [OptionalProps]?: ServiceZoneOptionalProps

  @PrimaryKey({ columnType: "text" })
  id: string

  @Property({ columnType: "text" })
  @Index({
    name: nameIndexName,
    expression: nameIndexStatement,
  })
  name: string

  @Property({ columnType: "jsonb", nullable: true })
  metadata: Record<string, unknown> | null = null

  @Property({ columnType: "text" })
  @Index({
    name: fulfillmentSetIdIndexName,
    expression: fulfillmentSetIdIndexStatement,
  })
  fulfillment_set_id: string

  @ManyToOne(() => FulfillmentSet, { persist: false })
  fulfillment_set: FulfillmentSet

  @OneToMany(() => GeoZone, "service_zone", {
    cascade: [Cascade.PERSIST, "soft-remove"] as any,
    orphanRemoval: true,
  })
  geo_zones = new Collection<GeoZone>(this)

  @OneToMany(
    () => ShippingOption,
    (shippingOption) => shippingOption.service_zone
  )
  shipping_options = new Collection<ShippingOption>(this)

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
    this.id = generateEntityId(this.id, "serzo")
    this.fulfillment_set_id ??= this.fulfillment_set?.id
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "serzo")
    this.fulfillment_set_id ??= this.fulfillment_set?.id
  }
}
