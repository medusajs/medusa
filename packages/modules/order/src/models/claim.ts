import { ClaimType, model } from "@zjedene-medusa/framework/utils"
import { OrderClaimItem } from "./claim-item"
import { Order } from "./order"
import { OrderShipping } from "./order-shipping-method"
import { Return } from "./return"
import { OrderTransaction } from "./transaction"

const _OrderClaim = model
  .define("OrderClaim", {
    id: model.id({ prefix: "claim" }).primaryKey(),
    order_version: model.number(),
    display_id: model.autoincrement(),
    type: model.enum(ClaimType),
    no_notification: model.boolean().nullable(),
    refund_amount: model.bigNumber().nullable(),
    created_by: model.text().nullable(),
    canceled_at: model.dateTime().nullable(),
    metadata: model.json().nullable(),
    order: model.hasOne<() => typeof Order>(() => Order, {
      mappedBy: undefined,
      foreignKey: true,
    }),
    return: model
      .hasOne<() => typeof Return>(() => Return, {
        mappedBy: undefined,
        foreignKey: true,
      })
      .nullable(),
    additional_items: model.hasMany<() => typeof OrderClaimItem>(
      () => OrderClaimItem,
      {
        mappedBy: "claim",
      }
    ),
    claim_items: model.hasMany<() => typeof OrderClaimItem>(
      () => OrderClaimItem,
      {
        mappedBy: "claim",
      }
    ),
    shipping_methods: model.hasMany<() => typeof OrderShipping>(
      () => OrderShipping,
      {
        mappedBy: "claim",
      }
    ),
    transactions: model.hasMany<() => typeof OrderTransaction>(
      () => OrderTransaction,
      {
        mappedBy: "claim",
      }
    ),
  })
  .cascades({
    delete: ["additional_items", "claim_items", "transactions"],
  })
  .indexes([
    {
      name: "IDX_order_claim_display_id",
      on: ["display_id"],
      unique: false,
      where: "deleted_at IS NULL",
    },
    {
      name: "IDX_order_claim_deleted_at",
      on: ["deleted_at"],
      unique: false,
      where: "deleted_at IS NOT NULL",
    },
    {
      name: "IDX_order_claim_order_id",
      on: ["order_id"],
      unique: false,
      where: "deleted_at IS NULL",
    },
    {
      name: "IDX_order_claim_return_id",
      on: ["return_id"],
      unique: false,
      where: "return_id IS NOT NULL AND deleted_at IS NULL",
    },
  ])

export const OrderClaim = _OrderClaim
