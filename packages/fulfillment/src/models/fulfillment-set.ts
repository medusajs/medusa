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
  OneToMany,
  OnInit,
  OptionalProps,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"
import ServiceZone from "./service-zone"

type FulfillmentSetOptionalProps = DAL.SoftDeletableEntityDateColumns

const DeletedAtIndex = createPsqlIndexStatementHelper({
  tableName: "fulfillment_set",
  columns: "deleted_at",
  where: "deleted_at IS NOT NULL",
})

const NameIndex = createPsqlIndexStatementHelper({
  tableName: "fulfillment_set",
  columns: "name",
  unique: true,
  where: "deleted_at IS NULL",
})

@Entity()
@Filter(DALUtils.mikroOrmSoftDeletableFilterOptions)
export default class FulfillmentSet {
  [OptionalProps]?: FulfillmentSetOptionalProps

  @PrimaryKey({ columnType: "text" })
  id: string

  @Property({ columnType: "text" })
  @NameIndex.MikroORMIndex()
  name: string

  @Property({ columnType: "text" })
  type: string

  @Property({ columnType: "jsonb", nullable: true })
  metadata: Record<string, unknown> | null = null

  @OneToMany(() => ServiceZone, "fulfillment_set", {
    cascade: [Cascade.PERSIST, "soft-remove"] as any,
    orphanRemoval: true,
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
  @DeletedAtIndex.MikroORMIndex()
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
