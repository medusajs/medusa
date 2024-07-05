import { DALUtils, Searchable, generateEntityId } from "@medusajs/utils"

import { DAL } from "@medusajs/types"
import {
  BeforeCreate,
  Entity,
  Filter,
  Index,
  OnInit,
  OptionalProps,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"

type SalesChannelOptionalProps = "is_disabled" | DAL.EntityDateColumns

@Entity()
@Filter(DALUtils.mikroOrmSoftDeletableFilterOptions)
export default class SalesChannel {
  [OptionalProps]?: SalesChannelOptionalProps

  @PrimaryKey({ columnType: "text" })
  id!: string

  @Searchable()
  @Property({ columnType: "text" })
  name!: string

  @Searchable()
  @Property({ columnType: "text", nullable: true })
  description: string | null = null

  @Property({ columnType: "boolean", default: false })
  is_disabled = false

  @Property({
    onCreate: () => new Date(),
    columnType: "timestamptz",
    defaultRaw: "now()",
  })
  created_at: Date

  @Property({ columnType: "jsonb", nullable: true })
  metadata: Record<string, unknown> | null = null

  @Property({
    onCreate: () => new Date(),
    onUpdate: () => new Date(),
    columnType: "timestamptz",
    defaultRaw: "now()",
  })
  updated_at: Date

  @Index({ name: "IDX_sales_channel_deleted_at" })
  @Property({ columnType: "timestamptz", nullable: true })
  deleted_at: Date | null = null

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "sc")
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "sc")
  }
}
