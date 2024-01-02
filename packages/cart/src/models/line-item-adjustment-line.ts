import { DALUtils, generateEntityId } from "@medusajs/utils"
import {
  BeforeCreate,
  Entity,
  Filter,
  ManyToOne,
  OnInit,
  PrimaryKey,
  Unique,
} from "@mikro-orm/core"
import AdjustmentLine from "./adjustment-line"
import LineItem from "./line-item"

@Entity({ tableName: "line_item_adjustment_line" })
@Unique({ properties: ["line_item_id", "id"] })
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
    this.id = generateEntityId(this.id, "liadj")
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "liadj")
  }
}
