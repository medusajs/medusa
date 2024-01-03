import { DALUtils, generateEntityId } from "@medusajs/utils"
import {
  BeforeCreate,
  Entity,
  Filter,
  ManyToOne,
  OnInit,
  PrimaryKey
} from "@mikro-orm/core"
import AdjustmentLine from "./adjustment-line"
import LineItem from "./line-item"

@Entity({ tableName: "cart_line_item_adjustment_line" })
@Filter(DALUtils.mikroOrmSoftDeletableFilterOptions)
export default class LineItemAdjustmentLine extends AdjustmentLine {
  @PrimaryKey({ columnType: "text" })
  line_item_id: string

  @ManyToOne(() => LineItem, {
    fieldName: "item_id",
  })
  line_item: LineItem

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "caliadj")
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "caliadj")
  }
}
