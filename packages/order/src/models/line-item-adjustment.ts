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
import AdjustmentLine from "./adjustment-line"
import LineItem from "./line-item"

const ItemIdIndex = createPsqlIndexStatementHelper({
  tableName: "order_line_item_adjustment",
  columns: "item_id",
})

@Entity({ tableName: "order_line_item_adjustment" })
export default class LineItemAdjustment extends AdjustmentLine {
  @ManyToOne({
    entity: () => LineItem,
    joinColumn: "item_id",
    cascade: [Cascade.REMOVE],
  })
  item: LineItem

  @Property({ columnType: "text" })
  @ItemIdIndex.MikroORMIndex()
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
