import { Entity, ManyToOne, PrimaryKey, Unique } from "@mikro-orm/core"
import AdjustmentLine from "./adjustment-line"
import ShippingMethod from "./shipping-method"

@Entity({ tableName: "shipping_method_adjustment_line" })
@Unique({ properties: ["shipping_method_id", "adjustment_line_id"] })
export default class ShippingMethodAdjustmentLine {
  @PrimaryKey({ columnType: "text" })
  shipping_method_id: string

  @PrimaryKey({ columnType: "text" })
  adjustment_line_id: string

  @ManyToOne(() => ShippingMethod, {
    fieldName: "shipping_method_id",
  })
  shipping_method: ShippingMethod

  @ManyToOne(() => AdjustmentLine, {
    fieldName: "adjustment_line_id",
  })
  adjustment_line: AdjustmentLine
}
