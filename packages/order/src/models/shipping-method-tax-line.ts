import { generateEntityId } from "@medusajs/utils"
import {
  BeforeCreate,
  Cascade,
  Entity,
  ManyToOne,
  OnInit,
  Property,
} from "@mikro-orm/core"
import ShippingMethod from "./shipping-method"
import TaxLine from "./tax-line"

@Entity({ tableName: "order_shipping_method_tax_line" })
export default class ShippingMethodTaxLine extends TaxLine {
  @ManyToOne({
    entity: () => ShippingMethod,
    index: "IDX_order_tax_line_shipping_method_id",
    cascade: [Cascade.REMOVE, Cascade.PERSIST],
  })
  shipping_method: ShippingMethod

  @Property({ columnType: "text" })
  shipping_method_id: string

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "ordsmtxl")
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "ordsmtxl")
  }
}
