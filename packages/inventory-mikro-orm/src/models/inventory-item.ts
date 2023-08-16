import {
  BeforeCreate,
  Collection,
  Entity,
  Index,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OptionalProps,
  PrimaryKey,
  Property,
  Unique,
} from "@mikro-orm/core"

import { BeforeUpdate } from "typeorm"
import InventoryLevel from "./inventory-level"
import { generateEntityId } from "@medusajs/utils"

type OptionalFields = "requires_shipping" | "created_at" | "updated_at"
@Entity({ tableName: "inventory_item" })
export class InventoryItem {
  [OptionalProps]?: OptionalFields

  @PrimaryKey({ columnType: "text" })
  id: string

  @Property({
    onCreate: () => new Date(),
    columnType: "timestamptz",
  })
  created_at: Date

  @Property({
    onCreate: () => new Date(),
    onUpdate: () => new Date(),
    columnType: "timestamptz",
  })
  updated_at: Date

  @Property({ columnType: "timestamptz", nullable: true })
  deleted_at: Date | null

  @Property({ columnType: "text", nullable: true })
  sku: string | null

  @Property({ columnType: "text", nullable: true })
  origin_country: string | null

  @Property({ columnType: "text", nullable: true })
  hs_code: string | null

  @Property({ columnType: "text", nullable: true })
  mid_code: string | null

  @Property({ columnType: "text", nullable: true })
  material: string | null

  @Property({ columnType: "numeric", nullable: true, serializer: Number })
  weight: number | null

  @Property({ columnType: "numeric", nullable: true, serializer: Number })
  length: number | null

  @Property({ columnType: "numeric", nullable: true, serializer: Number })
  height: number | null

  @Property({ columnType: "numeric", nullable: true, serializer: Number })
  width: number | null

  @Property({ default: true })
  requires_shipping: boolean

  @Property({ columnType: "text", nullable: true })
  description: string | null

  @Property({ columnType: "text", nullable: true })
  title: string | null

  @Property({ columnType: "text", nullable: true })
  thumbnail: string | null

  @Property({ columnType: "jsonb", nullable: true })
  metadata: Record<string, unknown> | null

  @OneToMany(() => InventoryLevel, (level) => level.inventory_item)
  inventory_levels: Collection<InventoryLevel> = new Collection<InventoryLevel>(
    this
  )

  @BeforeCreate()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "iitem")
  }
}

export default InventoryItem
