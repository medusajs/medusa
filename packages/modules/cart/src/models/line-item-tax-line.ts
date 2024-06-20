import {
  DALUtils,
  createPsqlIndexStatementHelper,
  generateEntityId,
} from "@medusajs/utils"
import {
  BeforeCreate,
  Entity,
  Filter,
  ManyToOne,
  OnInit,
  Property,
  Rel,
} from "@mikro-orm/core"
import LineItem from "./line-item"
import TaxLine from "./tax-line"

const LineItemIdIndex = createPsqlIndexStatementHelper({
  name: "IDX_tax_line_item_id",
  tableName: "cart_line_item_tax_line",
  columns: "item_id",
  where: "deleted_at IS NULL",
}).MikroORMIndex

const TaxRateIdIndex = createPsqlIndexStatementHelper({
  name: "IDX_line_item_tax_line_tax_rate_id",
  tableName: "cart_line_item_tax_line",
  columns: "tax_rate_id",
  where: "deleted_at IS NULL AND tax_rate_id IS NOT NULL",
}).MikroORMIndex

const DeletedAtIndex = createPsqlIndexStatementHelper({
  tableName: "cart_line_item_tax_line",
  columns: "deleted_at",
  where: "deleted_at IS NOT NULL",
}).MikroORMIndex

@Entity({ tableName: "cart_line_item_tax_line" })
@Filter(DALUtils.mikroOrmSoftDeletableFilterOptions)
export default class LineItemTaxLine extends TaxLine {
  @ManyToOne({ entity: () => LineItem, persist: false })
  item: Rel<LineItem>

  @LineItemIdIndex()
  @ManyToOne({
    entity: () => LineItem,
    columnType: "text",
    fieldName: "item_id",
    mapToPk: true,
  })
  item_id: string

  @TaxRateIdIndex()
  @Property({ columnType: "text", nullable: true })
  tax_rate_id: string | null = null

  @DeletedAtIndex()
  @Property({ columnType: "timestamptz", nullable: true })
  deleted_at: Date | null = null

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "calitxl")
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "calitxl")
  }
}
