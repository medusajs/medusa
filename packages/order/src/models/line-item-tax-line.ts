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

const ItemIdIndex = createPsqlIndexStatementHelper({
  tableName: "order_line_item_tax_line",
  columns: "item_id",
})

@Entity({ tableName: "order_line_item_tax_line" })
export default class LineItemTaxLine extends TaxLine {
  @ManyToOne({
    entity: () => LineItem,
    cascade: [Cascade.REMOVE, Cascade.PERSIST],
  })
  item: LineItem

  @Property({ columnType: "text" })
  @ItemIdIndex.MikroORMIndex()
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
