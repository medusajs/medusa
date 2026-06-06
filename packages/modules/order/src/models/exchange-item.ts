import { model } from "@zjedene-medusa/framework/utils"
import { OrderExchange } from "./exchange"
import { OrderLineItem } from "./line-item"

const _OrderExchangeItem = model
  .define("OrderExchangeItem", {
    id: model.id({ prefix: "oexcitem" }).primaryKey(),
    quantity: model.bigNumber(),
    note: model.text().nullable(),
    metadata: model.json().nullable(),
    exchange: model.belongsTo<() => typeof OrderExchange>(() => OrderExchange, {
      mappedBy: "additional_items",
    }),
    item: model.belongsTo<() => typeof OrderLineItem>(() => OrderLineItem, {
      mappedBy: "exchange_items",
    }),
  })
  .indexes([
    {
      name: "IDX_order_exchange_item_exchange_id",
      on: ["exchange_id"],
      unique: false,
      where: "deleted_at IS NULL",
    },
    {
      name: "IDX_order_exchange_item_item_id",
      on: ["item_id"],
      unique: false,
      where: "deleted_at IS NULL",
    },
    {
      name: "IDX_order_exchange_item_deleted_at",
      on: ["deleted_at"],
      unique: false,
      where: "deleted_at IS NOT NULL",
    },
  ])

export const OrderExchangeItem = _OrderExchangeItem
