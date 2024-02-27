import {
  createPsqlIndexStatementHelper,
  generateEntityId,
} from "@medusajs/utils"
import {
  BeforeCreate,
  Cascade,
  Entity,
  ManyToOne,
  OnInit,
  Property,
} from "@mikro-orm/core"
import AdjustmentLine from "./adjustment-line"
import ShippingMethod from "./shipping-method"

const ShippingMethodIdIdIndex = createPsqlIndexStatementHelper({
  tableName: "order_shipping_method_adjustment",
  columns: "shipping_method_id",
})

@Entity({ tableName: "order_shipping_method_adjustment" })
export default class ShippingMethodAdjustment extends AdjustmentLine {
  @ManyToOne({
    entity: () => ShippingMethod,
    fieldName: "shipping_method_id",
    cascade: [Cascade.REMOVE],
    persist: false
  })
  shipping_method: ShippingMethod

  @ManyToOne({
    entity: () => ShippingMethod,
    columnType: 'text',
    fieldName: "shipping_method_id",
    mapToPk: true,
    cascade: [Cascade.REMOVE],
  })
  @ShippingMethodIdIdIndex.MikroORMIndex()
  shipping_method_id: string

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "ordsmadj")
    this.shipping_method_id ??= this.shipping_method.id
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "ordsmadj")
    this.shipping_method_id ??= this.shipping_method.id
  }
}
