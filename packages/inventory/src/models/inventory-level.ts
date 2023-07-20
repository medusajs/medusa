import {
  BeforeCreate,
  Collection,
  Entity,
  Index,
  ManyToMany,
  OptionalProps,
  PrimaryKey,
  Property,
  Unique,
} from "@mikro-orm/core"

import { generateEntityId } from "@medusajs/utils"

type OptionalProperties =
  | "deleted_at"
  | "created_at"
  | "updated_at"
  | "stocked_quantity"
  | "reserved_quantity"
  | "incoming_quantity"

@Entity({ tableName: "inventory_level" })
@Unique({
  name: "IDX_inventory_level_item_id_location_id",
  properties: ["inventory_item_id", "location_id"],
})
export class InventoryLevel {
  [OptionalProps]?: OptionalProperties
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

  @Index({
    name: "IDX_inventory_level_inventory_item_id",
    expression: `CREATE INDEX "IDX_inventory_level_inventory_item_id" ON "inventory_level" ("inventory_item_id") WHERE deleted_at IS NULL;`,
  })
  @Property({ columnType: "text" })
  inventory_item_id: string

  @Index({
    name: "IDX_inventory_level_location_id",
    expression: `CREATE INDEX "IDX_inventory_level_location_id" ON "inventory_level" ("location_id") WHERE deleted_at IS NULL;`,
  })
  @Property({ columnType: "text" })
  location_id: string

  @Property({ columnType: "numeric", default: 0 })
  stocked_quantity: number

  @Property({ columnType: "numeric", default: 0 })
  reserved_quantity: number

  @Property({ columnType: "numeric", default: 0 })
  incoming_quantity: number

  @Property({ columnType: "jsonb", nullable: true })
  metadata: Record<string, unknown> | null

  @BeforeCreate()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "ilev")
  }
}

export default InventoryLevel
