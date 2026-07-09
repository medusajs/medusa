import { model } from "@medusajs/framework/utils"
import ShippingMethod from "./shipping-method"

/**
 * A tax line applied to a cart shipping method.
 */
const ShippingMethodTaxLine = model
  .define(
    {
      name: "ShippingMethodTaxLine",
      tableName: "cart_shipping_method_tax_line",
    },
    {
      id: model.id({ prefix: "casmtxl" }).primaryKey(),
      /**
       * The description of the tax line.
       */
      description: model.text().nullable(),
      /**
       * The code of the tax line.
       */
      code: model.text(),
      /**
       * The rate of the tax line.
       */
      rate: model.float(),
      /**
       * The ID of the associated tax provider.
       */
      provider_id: model.text().nullable(),
      /**
       * The ID of the associated tax rate.
       */
      tax_rate_id: model.text().nullable(),
      /**
       * Holds custom data in key-value pairs.
       */
      metadata: model.json().nullable(),
      /**
       * Holds data returned by the tax provider in key-value pairs.
       *
       * @since 2.17.3
       */
      data: model.json().nullable(),
      /**
       * The associated shipping method.
       */
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
