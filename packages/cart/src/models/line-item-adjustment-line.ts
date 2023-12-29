import { Entity, ManyToOne, Property, Unique } from "@mikro-orm/core"
import AdjustmentLine from "./adjustment-line"
import LineItem from "./line-item"

@Entity({ tableName: "line_item_adjustment_line" })
@Unique({ properties: ["line_item_id", "adjustment_line_id"] })
export class LineItemAdjustmentLine {
  @Property({ columnType: "text" })
  line_item_id: string

  @Property({ columnType: "text" })
  adjustment_line_id: string

  @ManyToOne(() => LineItem, {
    fieldName: "item_id",
  })
  line_item: LineItem

  @ManyToOne(() => AdjustmentLine, {
    fieldName: "adjustment_line_id",
  })
  adjustment_line: AdjustmentLine
}
