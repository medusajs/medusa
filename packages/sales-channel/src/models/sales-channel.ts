import { generateEntityId } from "@medusajs/utils"
import {
  BeforeCreate,
  Entity,
  Index,
  OptionalProps,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"

@Entity()
export default class SalesChannel {
  [OptionalProps]?: "created_at" | "updated_at" | "deleted_at"

  @PrimaryKey({ columnType: "text" })
  id!: string

  @Property({ columnType: "text" })
  name!: string

  @Property({ columnType: "text" })
  description!: string

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

  @Index({ name: "IDX_sales_channel_deleted_at" })
  @Property({ columnType: "timestamptz", nullable: true })
  deleted_at: Date

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "sc")
  }
}
