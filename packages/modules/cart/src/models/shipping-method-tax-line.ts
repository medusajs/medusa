import { model } from "@zjedene-medusa/framework/utils"
import ShippingMethod from "./shipping-method"

const ShippingMethodTaxLine = model
  .define(
    {
      name: "ShippingMethodTaxLine",
      tableName: "cart_shipping_method_tax_line",
    },
    {
      id: model.id({ prefix: "casmtxl" }).primaryKey(),
      description: model.text().nullable(),
      code: model.text(),
      rate: model.float(),
      provider_id: model.text().nullable(),
      tax_rate_id: model.text().nullable(),
      metadata: model.json().nullable(),
      shipping_method: model.belongsTo(() => ShippingMethod, {
        mappedBy: "tax_lines",
      }),
    }
  )
  .indexes([
    {
      name: "IDX_cart_shipping_method_tax_line_shipping_method_id",
      on: ["shipping_method_id"],
      where: "deleted_at IS NULL",
    },
    {
      name: "IDX_shipping_method_tax_line_tax_rate_id",
      on: ["tax_rate_id"],
      where: "deleted_at IS NULL AND tax_rate_id IS NOT NULL",
    },
  ])

export default ShippingMethodTaxLine
