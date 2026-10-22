import { model } from "@medusajs/framework/utils"
import { Order } from "./order"

const _OrderTag = model
  .define("OrderTag", {
    id: model.id({ prefix: "otag" }).primaryKey(),
    value: model.text().searchable(),
    metadata: model.json().nullable(),
    orders: model.manyToMany(() => Order, {
      mappedBy: "tags",
    }),
  })
  .indexes([
    {
      name: "IDX_order_tag_value_unique",
      on: ["value"],
      unique: true,
      where: "deleted_at IS NULL",
    },
  ])

export const OrderTag = _OrderTag
