import { model } from "@medusajs/framework/utils"

export const Note = model
  .define("Note", {
    id: model.id({ prefix: "note" }).primaryKey(),
    resource_type: model.enum(["order", "customer", "order_line_item"]),
    resource_id: model.text(),
    value: model.text(),
    author_id: model.text(),
  })
  .indexes([
    {
      on: ["resource_type", "resource_id"],
    },
  ])
