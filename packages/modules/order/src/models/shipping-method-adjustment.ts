import { model } from "@medusajs/framework/utils"
import { OrderShippingMethod } from "./shipping-method"

const _OrderShippingMethodAdjustment = model
  .define(
    {
      tableName: "order_shipping_method_adjustment",
      name: "OrderShippingMethodAdjustment",
    },
    {
      id: model.id({ prefix: "ordsmadj" }).primaryKey(),
      version: model.number().default(1),
      description: model.text().nullable(),
      promotion_id: model.text().nullable(),
      code: model.text().nullable(),
      amount: model.bigNumber(),
      provider_id: model.text().nullable(),
      shipping_method: model.belongsTo<() => typeof OrderShippingMethod>(
        () => OrderShippingMethod,
        {
          mappedBy: "adjustments",
        }
      ),
    }
  )
  .indexes([
    {
      name: "IDX_order_shipping_method_adjustment_shipping_method_id",
      on: ["shipping_method_id"],
      unique: false,
    },
    {
      name: "IDX_order_shipping_method_adjustment_version_shipping_method",
      on: ["version", "shipping_method_id"],
      unique: true,
      where: "deleted_at IS NULL",
    },
  ])

/**
 * The Order Shipping Method Adjustment data model. This model represents adjustments applied to 
 * order shipping methods, such as promotions or discounts.
 *
 * @since 2.13.7
 */
export const OrderShippingMethodAdjustment = _OrderShippingMethodAdjustment
