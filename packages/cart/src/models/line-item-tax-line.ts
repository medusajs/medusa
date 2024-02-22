import { DALUtils, createPsqlIndexStatementHelper, generateEntityId } from "@medusajs/utils"
import {
  BeforeCreate,
  Cascade,
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
    index: "IDX_tax_line_item_id",
    cascade: [Cascade.REMOVE, Cascade.PERSIST]
  })
  item: LineItem

  @Property({ columnType: "text" })
  item_id: string

  @Property({
    columnType: "text",
    nullable: true,
    index: "IDX_line_item_tax_line_tax_rate_id"
  })
  tax_rate_id?: string | null

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
