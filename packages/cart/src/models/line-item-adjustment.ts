import { generateEntityId } from "@medusajs/utils"
import {
  BeforeCreate,
  Check,
  Entity,
  ManyToOne,
  OnInit,
  Property,
} from "@mikro-orm/core"
import BigNumber from "bignumber.js"
import AdjustmentLine from "./adjustment-line"
import LineItem from "./line-item"

@Entity({ tableName: "cart_line_item_adjustment" })
@Check<LineItemAdjustment>({
  expression: (columns) => `${columns.amount} >= 0`,
})
export default class LineItemAdjustment extends AdjustmentLine {
  @ManyToOne(() => LineItem, {
    onDelete: "cascade",
    nullable: true,
    index: "IDX_adjustment_item_id",
  })
  item?: LineItem | null

  @Property({ columnType: "text" })
  item_id: string

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "caliadj")

    if (!this.amount) {
      this.raw_amount = {
        value: BigNumber(this.amount).multipliedBy(0.01).toFixed(8), // TODO: add sensible default for scale and decimal?
        scale: 8, // TODO: make configurable
      }
    }
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "caliadj")
  }
}
