import {
  DALUtils,
  Searchable,
  createPsqlIndexStatementHelper,
  generateEntityId,
} from "@medusajs/utils"

import { DAL } from "@medusajs/types"

import {
  BeforeCreate,
  Entity,
  OnInit,
  PrimaryKey,
  Property,
  Filter,
  OptionalProps,
} from "@mikro-orm/core"

type StoreOptionalProps = DAL.SoftDeletableEntityDateColumns

const StoreDeletedAtIndex = createPsqlIndexStatementHelper({
  tableName: "store",
  columns: "deleted_at",
  where: "deleted_at IS NOT NULL",
})

@Entity()
@Filter(DALUtils.mikroOrmSoftDeletableFilterOptions)
export default class Store {
  [OptionalProps]?: StoreOptionalProps

  @PrimaryKey({ columnType: "text" })
  id: string

  @Searchable()
  @Property({ columnType: "text", default: "Medusa Store" })
  name: string

  @Property({ type: "array", default: "{}" })
  supported_currency_codes: string[] = []

  @Property({ columnType: "text", nullable: true })
  default_currency_code: string | null = null

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

  @Property({
    onCreate: () => new Date(),
    onUpdate: () => new Date(),
    columnType: "timestamptz",
    defaultRaw: "now()",
  })
  updated_at: Date

  @StoreDeletedAtIndex.MikroORMIndex()
  @Property({ columnType: "timestamptz", nullable: true })
  deleted_at: Date | null = null

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "store")
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "store")
  }
}
