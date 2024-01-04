import { generateEntityId } from "@medusajs/utils"
import { BeforeCreate, Entity, ManyToOne, OnInit } from "@mikro-orm/core"
import ShippingMethod from "./shipping-method"
import TaxLine from "./tax-line"

@Entity({ tableName: "cart_shipping_method_tax_line" })
export default class ShippingMethodTaxLine extends TaxLine {
  @ManyToOne(() => ShippingMethod, {
    joinColumn: "shipping_method",
    fieldName: "shipping_method_id",
  })
  shipping_method: ShippingMethod

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "casmtxl")
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "casmtxl")
  }
}
