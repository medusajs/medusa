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
import ShippingMethod from "./shipping-method"
import TaxLine from "./tax-line"

@Entity({ tableName: "shipping_method_tax_line" })
@Unique({ properties: ["shipping_method_id", "id"] })
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
    this.id = generateEntityId(this.id, "smtxl")
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "smtxl")
  }
}
