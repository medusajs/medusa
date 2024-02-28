import {
  BeforeCreate,
  Entity,
  OnInit,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"

import { createPsqlIndexStatementHelper } from "@medusajs/utils"
import { generateEntityId } from "@medusajs/utils"

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

  @ReservationItemInventoryItemIdIndex.MikroORMIndex()
  @Property({ type: "text" })
  inventory_item_id: string

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

  @BeforeCreate()
  private beforeCreate(): void {
    this.id = generateEntityId(this.id, "ilev")
  }

  @OnInit()
  private onInit(): void {
    this.id = generateEntityId(this.id, "ilev")
  }
}
