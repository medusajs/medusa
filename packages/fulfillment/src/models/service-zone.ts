import { DALUtils, generateEntityId } from "@medusajs/utils"

import {
  BeforeCreate,
  Collection,
  Entity,
  Filter,
  Index,
  ManyToMany,
  OneToMany,
  OnInit,
  OptionalProps,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"
import { DAL } from "@medusajs/types"
import FulfillmentSet from "./fullfilment-set"
import GeoZone from "./geo-zone"
import ShippingOption from "./shipping-option"

type ServiceZoneOptionalProps = DAL.EntityDateColumns

@Entity()
@Filter(DALUtils.mikroOrmSoftDeletableFilterOptions)
export default class ServiceZone {
  [OptionalProps]?: ServiceZoneOptionalProps

  @PrimaryKey({ columnType: "text" })
  id: string

  @Property({ columnType: "text" })
  name: string

  @Property({ columnType: "jsonb", nullable: true })
  metadata: Record<string, unknown> | null = null

  @ManyToMany(
    () => FulfillmentSet,
    (fulfillmentSet) => fulfillmentSet.service_zones,
    {
      index: "IDX_service_zone_fulfillment_set_id",
      pivotTable: "fulfillment_set_service_zone",
    }
  )
  fulfillment_sets = new Collection<FulfillmentSet>(this)

  @ManyToMany(() => GeoZone, (geoZone) => geoZone.service_zones, {
    index: "IDX_service_zone_geo_zone_id",
    pivotTable: "service_zone_geo_zone",
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

  @Index({ name: "IDX_service_zone_deleted_at" })
  @Property({ columnType: "timestamptz", nullable: true })
  deleted_at: Date | null = null

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "serzo")
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "serzo")
  }
}
