import {
  createPsqlIndexStatementHelper,
  generateEntityId,
} from "@medusajs/framework/utils"
import { BeforeCreate, Entity, ManyToOne, OnInit, Rel } from "@mikro-orm/core"
import AdjustmentLine from "./adjustment-line"
import OrderLineItem from "./line-item"

const ItemIdIndex = createPsqlIndexStatementHelper({
  tableName: "order_line_item_adjustment",
  columns: "item_id",
})

@Entity({ tableName: "order_line_item_adjustment" })
export default class OrderLineItemAdjustment extends AdjustmentLine {
  @ManyToOne(() => OrderLineItem, {
    persist: false,
  })
  item: Rel<OrderLineItem>

  @ManyToOne({
    entity: () => OrderLineItem,
    columnType: "text",
    fieldName: "item_id",
    onDelete: "cascade",
    mapToPk: true,
  })
  @ItemIdIndex.MikroORMIndex()
  item_id: string

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "ordliadj")
    this.item_id ??= this.item?.id
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "ordliadj")
    this.item_id ??= this.item?.id
  }
}
