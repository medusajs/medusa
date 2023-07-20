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

type OptionalFields =
  | "line_item_id"
  | "created_at"
  | "updated_at"
  | "deleted_at"
  | "external_id"
  | "description"
  | "created_by"

@Entity({ tableName: "reservation_item" })
export class ReservationItem {
  [OptionalProps]?: OptionalFields

  @PrimaryKey({ columnType: "text" })
  id: string

  @Property({ onCreate: () => new Date(), columnType: "timestamptz" })
  created_at: Date

  @Property({
    onCreate: () => new Date(),
    onUpdate: () => new Date(),
    columnType: "timestamptz",
  })
  updated_at: Date

  @Property({ columnType: "timestamptz" })
  deleted_at: Date | null

  @Property({ columnType: "text", nullable: true })
  @Index({
    name: "IDX_reservation_item_line_item_id",
    expression: `CREATE INDEX "IDX_reservation_item_line_item_id" ON "reservation_item" ("line_item_id") WHERE deleted_at IS NULL;`,
  })
  line_item_id: string | null

  @Property({ columnType: "text" })
  @Index({
    name: "IDX_reservation_item_reservation_id",
    expression: `CREATE INDEX "IDX_reservation_item_inventory_item_id" ON "reservation_item" ("inventory_item_id") WHERE deleted_at IS NULL;`,
  })
  inventory_item_id: string

  @Property({ columnType: "text" })
  @Index({
    name: "IDX_reservation_item_location_id",
    expression: `CREATE INDEX "IDX_reservation_item_location_id" ON "reservation_item" ("location_id") WHERE deleted_at IS NULL;`,
  })
  location_id: string

  @Property({ columnType: "numeric" })
  quantity: number

  @Property({ columnType: "text", nullable: true })
  external_id: string | null

  @Property({ columnType: "text", nullable: true })
  description: string | null

  @Property({ columnType: "text", nullable: true })
  created_by: string | null

  @Property({ columnType: "jsonb", nullable: true })
  metadata: Record<string, unknown> | null

  @BeforeCreate()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "resitem")
  }
}

export default ReservationItem
