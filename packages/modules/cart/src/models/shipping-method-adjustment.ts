import { model } from "@zjedene-medusa/framework/utils"
import ShippingMethod from "./shipping-method"

const ShippingMethodAdjustment = model
  .define(
    {
      name: "ShippingMethodAdjustment",
      tableName: "cart_shipping_method_adjustment",
    },
    {
      id: model.id({ prefix: "casmadj" }).primaryKey(),
      description: model.text().nullable(),
      code: model.text().nullable(),
      amount: model.bigNumber(),
      provider_id: model.text().nullable(),
      metadata: model.json().nullable(),
      promotion_id: model.text().nullable(),
      shipping_method: model.belongsTo(() => ShippingMethod, {
        mappedBy: "adjustments",
      }),
    }
  )
  .indexes([
    {
      name: "IDX_shipping_method_adjustment_promotion_id",
      on: ["promotion_id"],
      where: "deleted_at IS NULL AND promotion_id IS NOT NULL",
    },
    {
      name: "IDX_cart_shipping_method_adjustment_shipping_method_id",
      on: ["shipping_method_id"],
      where: "deleted_at IS NULL",
    },
  ])

export default ShippingMethodAdjustment
