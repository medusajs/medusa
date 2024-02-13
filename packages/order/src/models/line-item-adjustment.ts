import { generateEntityId } from "@medusajs/utils"
import {
  BeforeCreate,
  Cascade,
  Check,
  Entity,
  ManyToOne,
  OnInit,
  Property,
} from "@mikro-orm/core"
import AdjustmentLine from "./adjustment-line"
import LineItem from "./line-item"

@Entity({ tableName: "order_line_item_adjustment" })
@Check<LineItemAdjustment>({
  expression: (columns) => `${columns.amount} >= 0`,
})
export default class LineItemAdjustment extends AdjustmentLine {
  @ManyToOne({
    entity: () => LineItem,
    index: "IDX_order_adjustment_item_id",
    cascade: [Cascade.REMOVE, Cascade.PERSIST],
  })
  item: LineItem

  @Property({ columnType: "text" })
  item_id: string

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "ordliadj")
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "ordliadj")
  }
}
