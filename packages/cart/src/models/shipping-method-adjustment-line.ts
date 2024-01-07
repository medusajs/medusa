import { generateEntityId } from "@medusajs/utils"
import { BeforeCreate, Entity, ManyToOne, OnInit } from "@mikro-orm/core"
import AdjustmentLine from "./adjustment-line"
import ShippingMethod from "./shipping-method"

@Entity({ tableName: "cart_shipping_method_adjustment_line" })
export default class ShippingMethodAdjustmentLine extends AdjustmentLine {
  @ManyToOne(() => ShippingMethod, {
    joinColumn: "shipping_method",
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
