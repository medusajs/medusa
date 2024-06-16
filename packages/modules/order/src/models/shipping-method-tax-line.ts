import {
  createPsqlIndexStatementHelper,
  generateEntityId,
} from "@medusajs/utils"
import { BeforeCreate, Entity, ManyToOne, OnInit, Rel } from "@mikro-orm/core"
import ShippingMethod from "./shipping-method"
import TaxLine from "./tax-line"

const ShippingMethodIdIdIndex = createPsqlIndexStatementHelper({
  tableName: "order_shipping_method_tax_line",
  columns: "shipping_method_id",
})

@Entity({ tableName: "order_shipping_method_tax_line" })
export default class ShippingMethodTaxLine extends TaxLine {
  @ManyToOne(() => ShippingMethod, {
    persist: false,
  })
  shipping_method: Rel<ShippingMethod>

  @ManyToOne({
    entity: () => ShippingMethod,
    fieldName: "shipping_method_id",
    columnType: "text",
    mapToPk: true,
    onDelete: "cascade",
  })
  @ShippingMethodIdIdIndex.MikroORMIndex()
  shipping_method_id: string

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "ordsmtxl")
    this.shipping_method_id ??= this.shipping_method?.id
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "ordsmtxl")
    this.shipping_method_id ??= this.shipping_method?.id
  }
}
