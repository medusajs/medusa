import { model } from "@zjedene-medusa/framework/utils"

import { OrderChange } from "./order-change"

const _OrderChangeAction = model
  .define("OrderChangeAction", {
    id: model.id({ prefix: "ordchact" }).primaryKey(),
    order_id: model.text(),
    return_id: model.text().nullable(),
    claim_id: model.text().nullable(),
    exchange_id: model.text().nullable(),
    ordering: model.autoincrement(),
    version: model.number().nullable(),
    reference: model.text().nullable(),
    reference_id: model.text().nullable(),
    action: model.text(),
    details: model.json().default({}),
    amount: model.bigNumber().nullable(),
    internal_note: model.text().nullable(),
    applied: model.boolean().default(false),
    order_change: model
      .belongsTo<() => typeof OrderChange>(() => OrderChange, {
        mappedBy: "actions",
      })
      .nullable(),
  })
  .indexes([
    {
      name: "IDX_order_change_action_order_change_id",
      on: ["order_change_id"],
      unique: false,
      where: "deleted_at IS NULL",
    },
    {
      name: "IDX_order_change_action_order_id",
      on: ["order_id"],
      unique: false,
      where: "deleted_at IS NULL",
    },
    {
      name: "IDX_order_change_action_return_id",
      on: ["return_id"],
      unique: false,
      where: "return_id IS NOT NULL AND deleted_at IS NULL",
    },
    {
      name: "IDX_order_change_action_claim_id",
      on: ["claim_id"],
      unique: false,
      where: "claim_id IS NOT NULL AND deleted_at IS NULL",
    },
    {
      name: "IDX_order_change_action_exchange_id",
      on: ["exchange_id"],
      unique: false,
      where: "exchange_id IS NOT NULL AND deleted_at IS NULL",
    },
    {
      name: "IDX_order_change_action_deleted_at",
      on: ["deleted_at"],
      unique: false,
      where: "deleted_at IS NOT NULL",
    },
    {
      name: "IDX_order_change_action_ordering",
      on: ["ordering"],
      unique: false,
      where: "deleted_at IS NULL",
    },
  ])

export const OrderChangeAction = _OrderChangeAction
