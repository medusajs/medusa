import { generateEntityId } from "@medusajs/utils"

import {
  BeforeCreate,
  Entity,
  OnInit,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"

@Entity()
export default class Store {
  @PrimaryKey({ columnType: "text" })
  id: string

  @Property({ columnType: "text" })
  name: string

  @Property({ columnType: "text", nullable: true })
  default_sales_channel_id: string | null = null

  @Property({ columnType: "text", nullable: true })
  default_region_id: string | null = null

  @Property({ columnType: "text", nullable: true })
  default_location_id: string | null = null

  @Property({ columnType: "jsonb", nullable: true })
  metadata: Record<string, unknown> | null = null

  @Property({
    onCreate: () => new Date(),
    columnType: "timestamptz",
    defaultRaw: "now()",
  })
  created_at: Date

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "store")
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "store")
  }
}
