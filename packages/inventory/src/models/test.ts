import {
  BeforeCreate,
  Collection,
  Entity,
  Index,
  ManyToMany,
  OptionalProps,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"

import { generateEntityId } from "@medusajs/utils"

@Entity({ tableName: "inventory_item" })
export class InventoryItem {
  @PrimaryKey({ columnType: "text" })
  id: string

  @Property({ columnType: "timestamptz", nullable: true })
  created_at: Date

  @Property({ columnType: "timestamptz", nullable: true })
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

  @Property({ columnType: "numeric" })
  weight: number | null

  @Property({ columnType: "numeric" })
  length: number | null

  @Property({ columnType: "numeric" })
  height: number | null

  @Property({ columnType: "numeric" })
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

  @BeforeCreate()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "iitem")
  }
}
