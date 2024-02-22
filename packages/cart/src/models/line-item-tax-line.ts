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
} from "@mikro-orm/core"
import LineItem from "./line-item"
import TaxLine from "./tax-line"

@Entity({ tableName: "cart_line_item_tax_line" })
@Filter(DALUtils.mikroOrmSoftDeletableFilterOptions)
export default class LineItemTaxLine extends TaxLine {
  @ManyToOne({
    entity: () => LineItem,
    persist: false,
  })
  item: LineItem

  @createPsqlIndexStatementHelper({
    name: "IDX_tax_line_item_id",
    tableName: "cart_line_item_tax_line",
    columns: "item_id",
    where: "deleted_at IS NULL",
  }).MikroORMIndex()
  @Property({ columnType: "text" })
  item_id: string

  @createPsqlIndexStatementHelper({
    name: "IDX_line_item_tax_line_tax_rate_id",
    tableName: "cart_line_item_tax_line",
    columns: "tax_rate_id",
    where: "deleted_at IS NULL AND tax_rate_id IS NOT NULL",
  }).MikroORMIndex()
  @Property({ columnType: "text", nullable: true })
  tax_rate_id: string | null = null

  @createPsqlIndexStatementHelper({
    tableName: "cart_line_item_tax_line",
    columns: "deleted_at",
    where: "deleted_at IS NOT NULL",
  }).MikroORMIndex()
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
