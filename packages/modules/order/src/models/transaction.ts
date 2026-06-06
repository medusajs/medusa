import {
  DmlEntity,
  DMLEntitySchemaBuilder,
  model,
} from "@zjedene-medusa/framework/utils"
import { OrderClaim } from "./claim"
import { OrderExchange } from "./exchange"
import { Order } from "./order"
import { Return } from "./return"

const _OrderTransaction = model
  .define("OrderTransaction", {
    id: model.id({ prefix: "ordtrx" }).primaryKey(),
    version: model.number().default(1),
    amount: model.bigNumber(),
    currency_code: model.text(),
    reference: model.text().nullable(),
    reference_id: model.text().nullable(),
    order: model.belongsTo<() => typeof Order>(() => Order, {
      mappedBy: "transactions",
    }),
    return: model
      .belongsTo<() => typeof Return>(() => Return, {
        mappedBy: "transactions",
      })
      .nullable(),
    exchange: model
      .belongsTo<() => typeof OrderExchange>(() => OrderExchange, {
        mappedBy: "transactions",
      })
      .nullable(),
    claim: model
      .belongsTo<() => typeof OrderClaim>(() => OrderClaim, {
        mappedBy: "transactions",
      })
      .nullable(),
  })
  .indexes([
    {
      name: "IDX_order_transaction_reference_id",
      on: ["reference_id"],
      unique: false,
      where: "deleted_at IS NULL",
    },
    {
      name: "IDX_order_transaction_order_id",
      on: ["order_id"],
      unique: false,
      where: "deleted_at IS NULL",
    },
    {
      name: "IDX_order_transaction_return_id",
      on: ["return_id"],
      unique: false,
      where: "return_id IS NOT NULL AND deleted_at IS NULL",
    },
    {
      name: "IDX_order_transaction_exchange_id",
      on: ["exchange_id"],
      unique: false,
      where: "exchange_id IS NOT NULL AND deleted_at IS NULL",
    },
    {
      name: "IDX_order_transaction_claim_id",
      on: ["claim_id"],
      unique: false,
      where: "claim_id IS NOT NULL AND deleted_at IS NULL",
    },
    {
      name: "IDX_order_transaction_currency_code",
      on: ["currency_code"],
      unique: false,
      where: "deleted_at IS NULL",
    },
    {
      name: "IDX_order_transaction_deleted_at",
      on: ["deleted_at"],
      unique: false,
      where: "deleted_at IS NOT NULL",
    },
    {
      name: "IDX_order_transaction_order_id_version",
      on: ["order_id", "version"],
      unique: false,
      where: "deleted_at IS NULL",
    },
  ])

export const OrderTransaction = _OrderTransaction as DmlEntity<
  DMLEntitySchemaBuilder<(typeof _OrderTransaction)["schema"]>,
  "OrderTransaction"
>
