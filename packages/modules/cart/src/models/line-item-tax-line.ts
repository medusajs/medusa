import { model } from "@zjedene-medusa/framework/utils"
import LineItem from "./line-item"

const LineItemTaxLine = model
  .define(
    {
      name: "LineItemTaxLine",
      tableName: "cart_line_item_tax_line",
    },
    {
      id: model.id({ prefix: "calitxl" }).primaryKey(),
      description: model.text().nullable(),
      code: model.text(),
      rate: model.float(),
      provider_id: model.text().nullable(),
      metadata: model.json().nullable(),
      tax_rate_id: model.text().nullable(),
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
