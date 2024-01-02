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
import ShippingMethod from "./shipping-method"

@Entity({ tableName: "shipping_method_adjustment_line" })
@Unique({ properties: ["shipping_method_id", "id"] })
@Filter(DALUtils.mikroOrmSoftDeletableFilterOptions)
export default class ShippingMethodAdjustmentLine extends AdjustmentLine {
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

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "smadj")
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "smadj")
  }
}
