import { DALUtils, generateEntityId } from "@medusajs/utils"

import {
  BeforeCreate,
  Collection,
  Entity,
  Filter,
  Index,
  ManyToMany,
  OnInit,
  OptionalProps,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"
import { DAL } from "@medusajs/types"
import ServiceZone from "./service-zone"

type FulfillmentSetOptionalProps = DAL.SoftDeletableEntityDateColumns

@Entity()
@Filter(DALUtils.mikroOrmSoftDeletableFilterOptions)
export default class FulfillmentSet {
  [OptionalProps]?: FulfillmentSetOptionalProps

  @PrimaryKey({ columnType: "text" })
  id: string

  @Property({ columnType: "text" })
  name: string

  @Property({ columnType: "jsonb", nullable: true })
  metadata: Record<string, unknown> | null = null

  @ManyToMany(() => ServiceZone, "fulfillment_sets", {
    owner: true,
    index: "IDX_fulfillment_set_service_zone_id",
    pivotTable: "fulfillment_set_service_zones",
    joinColumn: "fulfillment_set_id",
    inverseJoinColumn: "service_zone_id",
  })
  service_zones = new Collection<ServiceZone>(this)

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

  @Index({ name: "IDX_fulfillment_set_deleted_at" })
  @Property({ columnType: "timestamptz", nullable: true })
  deleted_at: Date | null = null

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "fuset")
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "fuset")
  }
}
