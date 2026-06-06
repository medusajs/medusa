import { model } from "@zjedene-medusa/framework/utils"
import { OrderClaim } from "./claim"
import { OrderExchange } from "./exchange"
import { Order } from "./order"
import { Return } from "./return"
import { OrderShippingMethod } from "./shipping-method"

const _OrderShipping = model
  .define("OrderShipping", {
    id: model.id({ prefix: "ordspmv" }).primaryKey(),
    version: model.number().default(1),
    order: model.belongsTo<() => typeof Order>(() => Order, {
      mappedBy: "shipping_methods",
    }),
    return: model
      .belongsTo<() => typeof Return>(() => Return, {
        mappedBy: "shipping_methods",
      })
      .nullable(),
    exchange: model
      .belongsTo<() => typeof OrderExchange>(() => OrderExchange, {
        mappedBy: "shipping_methods",
      })
      .nullable(),
    claim: model
      .belongsTo<() => typeof OrderClaim>(() => OrderClaim, {
        mappedBy: "shipping_methods",
      })
      .nullable(),
    shipping_method: model.hasOne<() => typeof OrderShippingMethod>(
      () => OrderShippingMethod,
      {
        mappedBy: undefined,
        foreignKey: true,
      }
    ),
  })
  .indexes([
    {
      name: "IDX_order_shipping_order_id",
      on: ["order_id"],
      unique: false,
      where: "deleted_at IS NULL",
    },
    {
      name: "IDX_order_shipping_return_id",
      on: ["return_id"],
      unique: false,
      where: "return_id IS NOT NULL AND deleted_at IS NULL",
    },
    {
      name: "IDX_order_shipping_exchange_id",
      on: ["exchange_id"],
      unique: false,
      where: "exchange_id IS NOT NULL AND deleted_at IS NULL",
    },
    {
      name: "IDX_order_shipping_claim_id",
      on: ["claim_id"],
      unique: false,
      where: "claim_id IS NOT NULL AND deleted_at IS NULL",
    },
    {
      name: "IDX_order_shipping_order_id_version",
      on: ["order_id", "version"],
      unique: false,
      where: "deleted_at IS NULL",
    },
    {
      name: "IDX_order_shipping_shipping_method_id",
      on: ["shipping_method_id"],
      unique: false,
      where: "deleted_at IS NULL",
    },
    {
      name: "IDX_order_shipping_deleted_at",
      on: ["deleted_at"],
      unique: false,
      where: "deleted_at IS NOT NULL",
    },
  ])

export const OrderShipping = _OrderShipping
