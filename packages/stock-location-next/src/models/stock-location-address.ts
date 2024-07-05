import {
  BeforeCreate,
  Entity,
  OnInit,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"
import {
  createPsqlIndexStatementHelper,
  generateEntityId,
} from "@medusajs/utils"

const StockLocationAddressDeletedAtIndex = createPsqlIndexStatementHelper({
  tableName: "stock_location_address",
  columns: "deleted_at",
  where: "deleted_at IS NOT NULL",
})

@Entity()
export class StockLocationAddress {
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

  @StockLocationAddressDeletedAtIndex.MikroORMIndex()
  @Property({ columnType: "timestamptz", nullable: true })
  deleted_at: Date | null = null

  @Property({ columnType: "text" })
  address_1: string

  @Property({ columnType: "text", nullable: true })
  address_2: string | null

  @Property({ columnType: "text", nullable: true })
  company: string | null

  @Property({ columnType: "text", nullable: true })
  city: string | null

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
  private beforeCreate(): void {
    this.id = generateEntityId(this.id, "laddr")
  }

  @OnInit()
  private onInit(): void {
    this.id = generateEntityId(this.id, "laddr")
  }
}
