import {
  createPsqlIndexStatementHelper,
  generateEntityId,
} from "@medusajs/utils"
import {
  BeforeCreate,
  Cascade,
  Entity,
  ManyToOne,
  OnInit,
  Property,
} from "@mikro-orm/core"
import LineItem from "./line-item"
import TaxLine from "./tax-line"

const orderIdIndexName = "IDX_order_item_order_id"
const orderIdIndexStatement = createPsqlIndexStatementHelper({
  name: orderIdIndexName,
  tableName: "order_item",
  columns: "order_id",
  where: "deleted_at IS NULL",
})

@Entity({ tableName: "order_line_item_tax_line" })
export default class LineItemTaxLine extends TaxLine {
  @ManyToOne({
    entity: () => LineItem,
    index: "IDX_order_tax_line_item_id",
    cascade: [Cascade.REMOVE, Cascade.PERSIST],
  })
  item: LineItem

  @Property({ columnType: "text" })
  item_id: string

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "ordlitxl")
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "ordlitxl")
  }
}
