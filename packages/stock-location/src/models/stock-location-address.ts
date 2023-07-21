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

@Entity({ tableName: "stock_location_address" })
export class StockLocationAddress {
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

  @Property({ columnType: "text" })
  address_1: string

  @Property({ columnType: "text", nullable: true })
  address_2: string | null

  @Property({ columnType: "text", nullable: true })
  company: string | null

  @Property({ columnType: "text", nullable: true })
  city: string | null

  @Index({ name: "IDX_stock_location_address_country_code" })
  @Property({ columnType: "text" })
  country_code: string

  @Property({ columnType: "text", nullable: true })
  phone: string | null

  @Property({ columnType: "text", nullable: true })
  province: string | null

  @Property({ columnType: "text", nullable: true })
  postal_code: string | null

  @Property({ columnType: "jsonb", nullable: true })
  metadata: Record<string, unknown> | null

  @BeforeCreate()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "laddr")
  }
}
