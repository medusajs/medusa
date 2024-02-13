import {
  createPsqlIndexStatementHelper,
  DALUtils,
  generateEntityId,
} from "@medusajs/utils"

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

const deletedAtIndexName = "IDX_fulfillment_set_deleted_at"
const deletedAtIndexStatement = createPsqlIndexStatementHelper({
  name: deletedAtIndexName,
  tableName: "fulfillment_set",
  columns: "deleted_at",
  where: "deleted_at IS NOT NULL",
})

const nameIndexName = "IDX_fulfillment_set_name_unique"
const nameIndexStatement = createPsqlIndexStatementHelper({
  name: nameIndexName,
  tableName: "fulfillment_set",
  columns: "name",
  unique: true,
  where: "deleted_at IS NOT NULL",
})

@Entity()
@Filter(DALUtils.mikroOrmSoftDeletableFilterOptions)
export default class FulfillmentSet {
  [OptionalProps]?: FulfillmentSetOptionalProps

  @PrimaryKey({ columnType: "text" })
  id: string

  @Property({ columnType: "text" })
  @Index({
    name: nameIndexName,
    expression: nameIndexStatement,
  })
  name: string

  @Property({ columnType: "text" })
  type: string

  @Property({ columnType: "jsonb", nullable: true })
  metadata: Record<string, unknown> | null = null

  @ManyToMany(() => ServiceZone, "fulfillment_sets", {
    owner: true,
    pivotTable: "fulfillment_set_service_zones",
    joinColumn: "fulfillment_set_id",
    inverseJoinColumn: "service_zone_id",
    fixedOrder: true,
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

  @Property({ columnType: "timestamptz", nullable: true })
  @Index({
    name: deletedAtIndexName,
    expression: deletedAtIndexStatement,
  })
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
