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
import ShippingMethod from "./shipping-method"

@Entity({ tableName: "cart_shipping_method_adjustment_line" })
@Filter(DALUtils.mikroOrmSoftDeletableFilterOptions)
export default class ShippingMethodAdjustmentLine extends AdjustmentLine {
  @PrimaryKey({ columnType: "text" })
  shipping_method_id: string

  @ManyToOne(() => ShippingMethod, {
    fieldName: "shipping_method_id",
  })
  shipping_method: ShippingMethod

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "casmadj")
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "casmadj")
  }
}
