import { model } from "@zjedene-medusa/framework/utils"

import { Fulfillment } from "./fulfillment"

export const FulfillmentItem = model
  .define("fulfillment_item", {
    id: model.id({ prefix: "fulit" }).primaryKey(),
    title: model.text(),
    sku: model.text(),
    barcode: model.text(),
    quantity: model.bigNumber(),
    line_item_id: model.text().nullable(),
    inventory_item_id: model.text().nullable(),
    fulfillment: model.belongsTo(() => Fulfillment, {
      mappedBy: "items",
    }),
  })
  .indexes([
    {
      on: ["inventory_item_id"],
      where: "deleted_at IS NULL",
    },
    {
      on: ["line_item_id"],
      where: "deleted_at IS NULL",
    },
  ])
