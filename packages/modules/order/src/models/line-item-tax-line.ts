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
  Rel,
} from "@mikro-orm/core"
import LineItem from "./line-item"
import TaxLine from "./tax-line"

const ItemIdIndex = createPsqlIndexStatementHelper({
  tableName: "order_line_item_tax_line",
  columns: "item_id",
})

@Entity({ tableName: "order_line_item_tax_line" })
export default class LineItemTaxLine extends TaxLine {
  @ManyToOne(() => LineItem, {
    fieldName: "item_id",
    persist: false,
  })
  item: Rel<LineItem>

  @ManyToOne({
    entity: () => LineItem,
    columnType: "text",
    fieldName: "item_id",
    cascade: [Cascade.PERSIST, Cascade.REMOVE],
    mapToPk: true,
  })
  @ItemIdIndex.MikroORMIndex()
  item_id: string

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "ordlitxl")
    this.item_id ??= this.item?.id
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "ordlitxl")
    this.item_id ??= this.item?.id
  }
}
