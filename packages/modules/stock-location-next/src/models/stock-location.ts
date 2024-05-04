import {
  DALUtils,
  Searchable,
  createPsqlIndexStatementHelper,
  generateEntityId,
} from "@medusajs/utils"
import {
  BeforeCreate,
  Entity,
  Filter,
  ManyToOne,
  OnInit,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"

import { StockLocationAddress } from "./stock-location-address"

const StockLocationDeletedAtIndex = createPsqlIndexStatementHelper({
  tableName: "stock_location",
  columns: "deleted_at",
  where: "deleted_at IS NOT NULL",
})

@Entity()
@Filter(DALUtils.mikroOrmSoftDeletableFilterOptions)
export class StockLocation {
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

  @StockLocationDeletedAtIndex.MikroORMIndex()
  @Property({ columnType: "timestamptz", nullable: true })
  deleted_at: Date | null = null

  @Searchable()
  @Property({ columnType: "text" })
  name: string

  @ManyToOne(() => StockLocationAddress, {
    fieldName: "address_id",
    type: "text",
    mapToPk: true,
    nullable: true,
    onDelete: "cascade",
  })
  address_id: string | null

  @ManyToOne(() => StockLocationAddress, {
    nullable: true,
  })
  address: StockLocationAddress | null

  @Property({ columnType: "jsonb", nullable: true })
  metadata: Record<string, unknown> | null

  @BeforeCreate()
  private beforeCreate(): void {
    this.id = generateEntityId(this.id, "sloc")
  }

  @OnInit()
  private onInit(): void {
    this.id = generateEntityId(this.id, "sloc")
  }
}
