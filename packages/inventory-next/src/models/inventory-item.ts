import {
  BeforeCreate,
  Collection,
  Entity,
  Filter,
  OnInit,
  OneToMany,
  OptionalProps,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"
import {
  DALUtils,
  createPsqlIndexStatementHelper,
  generateEntityId,
} from "@medusajs/utils"

import { DAL } from "@medusajs/types"
import { InventoryLevel } from "./inventory-level"

const InventoryItemDeletedAtIndex = createPsqlIndexStatementHelper({
  tableName: "inventory_item",
  columns: "deleted_at",
  where: "deleted_at IS NOT NULL",
})

const InventoryItemSkuIndex = createPsqlIndexStatementHelper({
  tableName: "inventory_item",
  columns: "sku",
  unique: true,
})

type InventoryItemOptionalProps = DAL.SoftDeletableEntityDateColumns

@Entity()
@Filter(DALUtils.mikroOrmSoftDeletableFilterOptions)
export class InventoryItem {
  [OptionalProps]: InventoryItemOptionalProps

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

  @InventoryItemDeletedAtIndex.MikroORMIndex()
  @Property({ columnType: "timestamptz", nullable: true })
  deleted_at: Date | null = null

  @InventoryItemSkuIndex.MikroORMIndex()
  @Property({ columnType: "text", nullable: true })
  sku: string | null = null

  @Property({ columnType: "text", nullable: true })
  origin_country: string | null = null

  @Property({ columnType: "text", nullable: true })
  hs_code: string | null = null

  @Property({ columnType: "text", nullable: true })
  mid_code: string | null = null

  @Property({ columnType: "text", nullable: true })
  material: string | null = null

  @Property({ type: "int", nullable: true })
  weight: number | null = null

  @Property({ type: "int", nullable: true })
  length: number | null = null

  @Property({ type: "int", nullable: true })
  height: number | null = null

  @Property({ type: "int", nullable: true })
  width: number | null = null

  @Property({ columnType: "boolean" })
  requires_shipping: boolean = true

  @Property({ columnType: "text", nullable: true })
  description: string | null = null

  @Property({ columnType: "text", nullable: true })
  title: string | null = null

  @Property({ columnType: "text", nullable: true })
  thumbnail: string | null = null

  @Property({ columnType: "jsonb", nullable: true })
  metadata: Record<string, unknown> | null = null

  @OneToMany(
    () => InventoryLevel,
    (inventoryLevel) => inventoryLevel.inventory_item
  )
  inventory_levels = new Collection<InventoryLevel>(this)

  @BeforeCreate()
  private beforeCreate(): void {
    this.id = generateEntityId(this.id, "iitem")
  }

  @OnInit()
  private onInit(): void {
    this.id = generateEntityId(this.id, "iitem")
  }
}
