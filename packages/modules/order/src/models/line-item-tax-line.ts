import {
  createPsqlIndexStatementHelper,
  generateEntityId,
} from "@medusajs/framework/utils"
import {
  BeforeCreate,
  Cascade,
  Entity,
  ManyToOne,
  OnInit,
  Rel,
} from "@mikro-orm/core"
import OrderLineItem from "./line-item"
import TaxLine from "./tax-line"

const ItemIdIndex = createPsqlIndexStatementHelper({
  tableName: "order_line_item_tax_line",
  columns: "item_id",
})

@Entity({ tableName: "order_line_item_tax_line" })
export default class OrderLineItemTaxLine extends TaxLine {
  @ManyToOne(() => OrderLineItem, {
    fieldName: "item_id",
    persist: false,
  })
  item: Rel<OrderLineItem>

  @ManyToOne({
    entity: () => OrderLineItem,
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
