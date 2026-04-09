import { model } from "@medusajs/framework/utils"

import { OrderLineItem } from "./line-item"
import { Order } from "./order"

const _OrderItem = model
  .define("OrderItem", {
    id: model.id({ prefix: "orditem" }).primaryKey(),
    version: model.number().default(1),
    unit_price: model.bigNumber().nullable(),
    compare_at_unit_price: model.bigNumber().nullable(),
    quantity: model.bigNumber(),
    fulfilled_quantity: model.bigNumber().default(0),
    delivered_quantity: model.bigNumber().default(0),
    shipped_quantity: model.bigNumber().default(0),
    return_requested_quantity: model.bigNumber().default(0),
    return_received_quantity: model.bigNumber().default(0),
    return_dismissed_quantity: model.bigNumber().default(0),
    written_off_quantity: model.bigNumber().default(0),
    metadata: model.json().nullable(),
    order: model.belongsTo<() => typeof Order>(() => Order, {
      mappedBy: "items",
    }),
    item: model.hasOne<() => typeof OrderLineItem>(() => OrderLineItem, {
      mappedBy: undefined,
      foreignKey: true,
    }),
  })
  .indexes([
    {
      name: "IDX_order_item_order_id",
      on: ["order_id"],
      unique: false,
      where: "deleted_at IS NULL",
    },
    {
      name: "IDX_order_item_order_id_version",
      on: ["order_id", "version"],
      unique: false,
      where: "deleted_at IS NULL",
    },
    {
      name: "IDX_order_item_item_id",
      on: ["item_id"],
      unique: false,
      where: "deleted_at IS NULL",
    },
    {
      name: "IDX_order_item_deleted_at",
      on: ["deleted_at"],
      unique: false,
      where: "deleted_at IS NOT NULL",
    },
  ])

export const OrderItem = _OrderItem
