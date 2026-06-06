import { model } from "@zjedene-medusa/framework/utils"
import { OrderShippingMethodAdjustment } from "./shipping-method-adjustment"
import { OrderShippingMethodTaxLine } from "./shipping-method-tax-line"

const _OrderShippingMethod = model
  .define("OrderShippingMethod", {
    id: model.id({ prefix: "ordsm" }).primaryKey(),
    name: model.text(),
    description: model.json().nullable(),
    amount: model.bigNumber(),
    is_tax_inclusive: model.boolean().default(false),
    is_custom_amount: model.boolean().default(false),
    shipping_option_id: model.text().nullable(),
    data: model.json().nullable(),
    metadata: model.json().nullable(),
    tax_lines: model.hasMany<() => typeof OrderShippingMethodTaxLine>(
      () => OrderShippingMethodTaxLine,
      {
        mappedBy: "shipping_method",
      }
    ),
    adjustments: model.hasMany<() => typeof OrderShippingMethodAdjustment>(
      () => OrderShippingMethodAdjustment,
      {
        mappedBy: "shipping_method",
      }
    ),
  })
  .cascades({
    delete: ["tax_lines", "adjustments"],
  })
  .indexes([
    {
      name: "IDX_order_shipping_method_shipping_option_id",
      on: ["shipping_option_id"],
      unique: false,
    },
  ])

export const OrderShippingMethod = _OrderShippingMethod
