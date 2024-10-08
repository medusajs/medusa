import {
  createPsqlIndexStatementHelper,
  generateEntityId,
} from "@medusajs/framework/utils"
import { BeforeCreate, Entity, ManyToOne, OnInit, Rel } from "@mikro-orm/core"
import AdjustmentLine from "./adjustment-line"
import OrderShippingMethod from "./shipping-method"

const ShippingMethodIdIdIndex = createPsqlIndexStatementHelper({
  tableName: "order_shipping_method_adjustment",
  columns: "shipping_method_id",
})

@Entity({ tableName: "order_shipping_method_adjustment" })
export default class OrderShippingMethodAdjustment extends AdjustmentLine {
  @ManyToOne(() => OrderShippingMethod, {
    persist: false,
  })
  shipping_method: Rel<OrderShippingMethod>

  @ManyToOne({
    entity: () => OrderShippingMethod,
    columnType: "text",
    fieldName: "shipping_method_id",
    mapToPk: true,
    onDelete: "cascade",
  })
  @ShippingMethodIdIdIndex.MikroORMIndex()
  shipping_method_id: string

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "ordsmadj")
    this.shipping_method_id ??= this.shipping_method?.id
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "ordsmadj")
    this.shipping_method_id ??= this.shipping_method?.id
  }
}
