import { model } from "@medusajs/framework/utils"
import Cart from "./cart"
import ShippingMethodAdjustment from "./shipping-method-adjustment"
import ShippingMethodTaxLine from "./shipping-method-tax-line"

const ShippingMethod = model
  .define(
    {
      name: "ShippingMethod",
      tableName: "cart_shipping_method",
    },
    {
      id: model.id({ prefix: "casm" }).primaryKey(),
      name: model.text(),
      description: model.json().nullable(),
      amount: model.bigNumber(),
      is_tax_inclusive: model.boolean().default(false),
      shipping_option_id: model.text().nullable(),
      data: model.json().nullable(),
      metadata: model.json().nullable(),
      original_total: model.bigNumber().computed(),
      original_subtotal: model.bigNumber().computed(),
      original_tax_total: model.bigNumber().computed(),
      total: model.bigNumber().computed(),
      subtotal: model.bigNumber().computed(),
      tax_total: model.bigNumber().computed(),
      discount_total: model.bigNumber().computed(),
      discount_tax_total: model.bigNumber().computed(),
      cart: model.belongsTo(() => Cart, {
        mappedBy: "shipping_methods",
      }),
      tax_lines: model.hasMany(() => ShippingMethodTaxLine, {
        mappedBy: "shipping_method",
      }),
      adjustments: model.hasMany(() => ShippingMethodAdjustment, {
        mappedBy: "shipping_method",
      }),
    }
  )
  .indexes([
    {
      name: "IDX_cart_shipping_method_cart_id",
      on: ["cart_id"],
      where: "deleted_at IS NULL",
    },
    {
      name: "IDX_shipping_method_option_id",
      on: ["shipping_option_id"],
      where: "deleted_at IS NULL AND shipping_option_id IS NOT NULL",
    },
  ])
  .checks([(columns) => `${columns.amount} >= 0`])

export default ShippingMethod
