import { DALUtils, generateEntityId } from "@medusajs/utils"
import {
  BeforeCreate,
  Entity,
  Filter,
  ManyToOne,
  OnInit,
  PrimaryKey
} from "@mikro-orm/core"
import ShippingMethod from "./shipping-method"
import TaxLine from "./tax-line"

@Entity({ tableName: "cart_shipping_method_tax_line" })
@Filter(DALUtils.mikroOrmSoftDeletableFilterOptions)
export default class ShippingMethodTaxLine extends TaxLine {
  @PrimaryKey({ columnType: "text" })
  shipping_method_id: string

  @ManyToOne(() => ShippingMethod, {
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
