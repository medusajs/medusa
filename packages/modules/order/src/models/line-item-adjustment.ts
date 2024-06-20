import {
  createPsqlIndexStatementHelper,
  generateEntityId,
} from "@medusajs/utils"
import { BeforeCreate, Entity, ManyToOne, OnInit, Rel } from "@mikro-orm/core"
import AdjustmentLine from "./adjustment-line"
import LineItem from "./line-item"

const ItemIdIndex = createPsqlIndexStatementHelper({
  tableName: "order_line_item_adjustment",
  columns: "item_id",
})

@Entity({ tableName: "order_line_item_adjustment" })
export default class LineItemAdjustment extends AdjustmentLine {
  @ManyToOne(() => LineItem, {
    persist: false,
  })
  item: Rel<LineItem>

  @ManyToOne({
    entity: () => LineItem,
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
