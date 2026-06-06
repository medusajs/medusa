import { model, ReturnStatus } from "@zjedene-medusa/framework/utils"
import { OrderClaim } from "./claim"
import { OrderExchange } from "./exchange"
import { Order } from "./order"
import { OrderShipping } from "./order-shipping-method"
import { ReturnItem } from "./return-item"
import { OrderTransaction } from "./transaction"

const _Return = model
  .define("Return", {
    id: model.id({ prefix: "return" }).primaryKey(),
    order_version: model.number(),
    display_id: model.autoincrement(),
    status: model.enum(ReturnStatus).default(ReturnStatus.OPEN),
    location_id: model.text().nullable(),
    no_notification: model.boolean().nullable(),
    refund_amount: model.bigNumber().nullable(),
    created_by: model.text().nullable(),
    metadata: model.json().nullable(),
    requested_at: model.dateTime().nullable(),
    received_at: model.dateTime().nullable(),
    canceled_at: model.dateTime().nullable(),
    order: model.belongsTo<() => typeof Order>(() => Order, {
      mappedBy: "returns",
    }),
    exchange: model
      .hasOne<() => typeof OrderExchange>(() => OrderExchange, {
        mappedBy: undefined,
        foreignKey: true,
      })
      .nullable(),
    claim: model
      .hasOne<() => typeof OrderClaim>(() => OrderClaim, {
        mappedBy: undefined,
        foreignKey: true,
      })
      .nullable(),
    items: model.hasMany<() => typeof ReturnItem>(() => ReturnItem, {
      mappedBy: "return",
    }),
    shipping_methods: model.hasMany<() => typeof OrderShipping>(
      () => OrderShipping,
      {
        mappedBy: "return",
      }
    ),
    transactions: model.hasMany<() => typeof OrderTransaction>(
      () => OrderTransaction,
      {
        mappedBy: "return",
      }
    ),
  })
  .cascades({
    delete: ["items", "shipping_methods", "transactions"],
  })
  .indexes([
    {
      name: "IDX_return_display_id",
      on: ["display_id"],
      unique: false,
      where: "deleted_at IS NULL",
    },
    {
      name: "IDX_return_deleted_at",
      on: ["deleted_at"],
      unique: false,
      where: "deleted_at IS NOT NULL",
    },
    {
      name: "IDX_return_order_id",
      on: ["order_id"],
      unique: false,
      where: "deleted_at IS NULL",
    },
    {
      name: "IDX_return_exchange_id",
      on: ["exchange_id"],
      unique: false,
      where: "exchange_id IS NOT NULL AND deleted_at IS NULL",
    },
    {
      name: "IDX_return_claim_id",
      on: ["claim_id"],
      unique: false,
      where: "claim_id IS NOT NULL AND deleted_at IS NULL",
    },
  ])

export const Return = _Return
