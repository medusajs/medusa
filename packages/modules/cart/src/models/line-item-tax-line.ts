import { model } from "@medusajs/framework/utils"
import LineItem from "./line-item"

/**
 * A tax line applied to a cart line item.
 */
const LineItemTaxLine = model
  .define(
    {
      name: "LineItemTaxLine",
      tableName: "cart_line_item_tax_line",
    },
    {
      id: model.id({ prefix: "calitxl" }).primaryKey(),
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
       * The ID of the associated tax rate.
       */
      tax_rate_id: model.text().nullable(),
      /**
       * The associated line item.
       */
      item: model.belongsTo(() => LineItem, {
        mappedBy: "tax_lines",
      }),
    }
  )
  .indexes([
    {
      name: "IDX_line_item_tax_line_tax_rate_id",
      on: ["tax_rate_id"],
      where: "deleted_at IS NULL AND tax_rate_id IS NOT NULL",
    },
    {
      name: "IDX_cart_line_item_tax_line_item_id",
      on: ["item_id"],
      where: "deleted_at IS NULL",
    },
  ])

export default LineItemTaxLine
