import { generateEntityId } from "@medusajs/utils"
import {
  BeforeCreate,
  Entity,
  ManyToOne,
  OnInit,
  Property,
} from "@mikro-orm/core"
import ShippingMethod from "./shipping-method"
import TaxLine from "./tax-line"

@Entity({ tableName: "cart_shipping_method_tax_line" })
export default class ShippingMethodTaxLine extends TaxLine {
  @ManyToOne(() => ShippingMethod, {
    onDelete: "cascade",
    nullable: true,
    index: "IDX_tax_line_shipping_method_id",
  })
  shipping_method: ShippingMethod | null

  @Property({ columnType: "text" })
  shipping_method_id: string

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "casmtxl")
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "casmtxl")
  }
}
