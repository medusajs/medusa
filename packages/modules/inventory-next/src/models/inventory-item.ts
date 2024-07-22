import {
  createPsqlIndexStatementHelper,
  DALUtils,
  generateEntityId,
  Searchable,
} from "@medusajs/utils"
import {
  BeforeCreate,
  Collection,
  Entity,
  Filter,
  Formula,
  OneToMany,
  OnInit,
  OptionalProps,
  PrimaryKey,
  Property,
  Rel,
} from "@mikro-orm/core"

import { DAL } from "@medusajs/types"
import { InventoryLevel } from "./inventory-level"
import { ReservationItem } from "./reservation-item"

const InventoryItemDeletedAtIndex = createPsqlIndexStatementHelper({
  tableName: "inventory_item",
  columns: "deleted_at",
  where: "deleted_at IS NOT NULL",
})

const InventoryItemSkuIndex = createPsqlIndexStatementHelper({
  tableName: "inventory_item",
  columns: "sku",
  unique: true,
  where: "deleted_at IS NULL",
})

type InventoryItemOptionalProps = DAL.SoftDeletableModelDateColumns

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
  @Searchable()
  @Property({ columnType: "text", nullable: true })
  sku: string | null = null

  @Property({ columnType: "text", nullable: true })
  origin_country: string | null = null

  @Searchable()
  @Property({ columnType: "text", nullable: true })
  hs_code: string | null = null

  @Searchable()
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

  @Searchable()
  @Property({ columnType: "text", nullable: true })
  description: string | null = null

  @Searchable()
  @Property({ columnType: "text", nullable: true })
  title: string | null = null

  @Property({ columnType: "text", nullable: true })
  thumbnail: string | null = null

  @Property({ columnType: "jsonb", nullable: true })
  metadata: Record<string, unknown> | null = null

  @OneToMany(
    () => InventoryLevel,
    (inventoryLevel) => inventoryLevel.inventory_item,
    {
      cascade: ["soft-remove" as any],
    }
  )
  location_levels = new Collection<Rel<InventoryLevel>>(this)

  @OneToMany(
    () => ReservationItem,
    (reservationItem) => reservationItem.inventory_item,
    {
      cascade: ["soft-remove" as any],
    }
  )
  reservation_items = new Collection<Rel<ReservationItem>>(this)

  @Formula(
    (item) =>
      `(SELECT SUM(reserved_quantity) FROM inventory_level il WHERE il.inventory_item_id = ${item}.id AND il.deleted_at IS NULL)`,
    { lazy: true, serializer: Number, hidden: true }
  )
  reserved_quantity: number

  @Formula(
    (item) =>
      `(SELECT SUM(stocked_quantity) FROM inventory_level il WHERE il.inventory_item_id = ${item}.id AND il.deleted_at IS NULL)`,
    { lazy: true, serializer: Number, hidden: true }
  )
  stocked_quantity: number

  @BeforeCreate()
  private beforeCreate(): void {
    this.id = generateEntityId(this.id, "iitem")
  }

  @OnInit()
  private onInit(): void {
    this.id = generateEntityId(this.id, "iitem")
  }
}
