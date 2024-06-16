import {
  BeforeCreate,
  Entity,
  Filter,
  ManyToOne,
  OnInit,
  PrimaryKey,
  Property,
  Rel,
} from "@mikro-orm/core"

import {
  DALUtils,
  createPsqlIndexStatementHelper,
  generateEntityId,
} from "@medusajs/utils"
import { InventoryItem } from "./inventory-item"

const ReservationItemDeletedAtIndex = createPsqlIndexStatementHelper({
  tableName: "reservation_item",
  columns: "deleted_at",
  where: "deleted_at IS NOT NULL",
})
const ReservationItemLineItemIdIndex = createPsqlIndexStatementHelper({
  tableName: "reservation_item",
  columns: "line_item_id",
})

const ReservationItemInventoryItemIdIndex = createPsqlIndexStatementHelper({
  tableName: "reservation_item",
  columns: "inventory_item_id",
})

const ReservationItemLocationIdIndex = createPsqlIndexStatementHelper({
  tableName: "reservation_item",
  columns: "location_id",
})

@Entity()
@Filter(DALUtils.mikroOrmSoftDeletableFilterOptions)
export class ReservationItem {
  @PrimaryKey({ columnType: "text" })
  id: string

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

  @ReservationItemDeletedAtIndex.MikroORMIndex()
  @Property({ columnType: "timestamptz", nullable: true })
  deleted_at: Date | null = null

  @ReservationItemLineItemIdIndex.MikroORMIndex()
  @Property({ type: "text", nullable: true })
  line_item_id: string | null = null

  @Property({ type: "boolean" })
  allow_backorder: boolean = false

  @ReservationItemLocationIdIndex.MikroORMIndex()
  @Property({ type: "text" })
  location_id: string

  @Property({ columnType: "integer" })
  quantity: number

  @Property({ type: "text", nullable: true })
  external_id: string | null = null

  @Property({ type: "text", nullable: true })
  description: string | null = null

  @Property({ type: "text", nullable: true })
  created_by: string | null = null

  @Property({ type: "jsonb", nullable: true })
  metadata: Record<string, unknown> | null = null

  @ReservationItemInventoryItemIdIndex.MikroORMIndex()
  @ManyToOne(() => InventoryItem, {
    fieldName: "inventory_item_id",
    type: "text",
    mapToPk: true,
    onDelete: "cascade",
  })
  inventory_item_id: string

  @ManyToOne(() => InventoryItem, {
    persist: false,
  })
  inventory_item: Rel<InventoryItem>

  @BeforeCreate()
  private beforeCreate(): void {
    this.id = generateEntityId(this.id, "resitem")
  }

  @OnInit()
  private onInit(): void {
    this.id = generateEntityId(this.id, "resitem")
  }
}
