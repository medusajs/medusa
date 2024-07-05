import {
  BeforeCreate,
  Entity,
  Filter,
  ManyToOne,
  OnInit,
  OnLoad,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"
import { DALUtils, isDefined } from "@medusajs/utils"

import { InventoryItem } from "./inventory-item"
import { createPsqlIndexStatementHelper } from "@medusajs/utils"
import { generateEntityId } from "@medusajs/utils"

const InventoryLevelDeletedAtIndex = createPsqlIndexStatementHelper({
  tableName: "inventory_level",
  columns: "deleted_at",
  where: "deleted_at IS NOT NULL",
})

const InventoryLevelInventoryItemIdIndex = createPsqlIndexStatementHelper({
  tableName: "inventory_level",
  columns: "inventory_item_id",
})

const InventoryLevelLocationIdIndex = createPsqlIndexStatementHelper({
  tableName: "inventory_level",
  columns: "location_id",
})

const InventoryLevelLocationIdInventoryItemIdIndex =
  createPsqlIndexStatementHelper({
    tableName: "inventory_level",
    columns: "location_id",
  })

@Entity()
@InventoryLevelLocationIdInventoryItemIdIndex.MikroORMIndex()
@Filter(DALUtils.mikroOrmSoftDeletableFilterOptions)
export class InventoryLevel {
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

  @InventoryLevelDeletedAtIndex.MikroORMIndex()
  @Property({ columnType: "timestamptz", nullable: true })
  deleted_at: Date | null = null

  @ManyToOne(() => InventoryItem, {
    fieldName: "inventory_item_id",
    type: "text",
    mapToPk: true,
    onDelete: "cascade",
  })
  @InventoryLevelInventoryItemIdIndex.MikroORMIndex()
  inventory_item_id: string

  @InventoryLevelLocationIdIndex.MikroORMIndex()
  @Property({ type: "text" })
  location_id: string

  @Property({ type: "int" })
  stocked_quantity: number = 0

  @Property({ type: "int" })
  reserved_quantity: number = 0

  @Property({ type: "int" })
  incoming_quantity: number = 0

  @Property({ columnType: "jsonb", nullable: true })
  metadata: Record<string, unknown> | null

  @ManyToOne(() => InventoryItem, {
    persist: false,
  })
  inventory_item: InventoryItem

  available_quantity: number | null = null

  @BeforeCreate()
  private beforeCreate(): void {
    this.id = generateEntityId(this.id, "ilev")
    this.inventory_item_id ??= this.inventory_item?.id
  }

  @OnInit()
  private onInit(): void {
    this.id = generateEntityId(this.id, "ilev")
  }

  @OnLoad()
  private onLoad(): void {
    if (isDefined(this.stocked_quantity) && isDefined(this.reserved_quantity)) {
      this.available_quantity = this.stocked_quantity - this.reserved_quantity
    }
  }
}
