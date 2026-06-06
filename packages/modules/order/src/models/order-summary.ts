import { model } from "@zjedene-medusa/framework/utils"
import { Order } from "./order"

const _OrderSummary = model
  .define(
    {
      tableName: "order_summary",
      name: "OrderSummary",
    },
    {
      id: model.id({ prefix: "ordsum" }).primaryKey(),
      version: model.number().default(1),
      totals: model.json(),
      order: model.belongsTo<() => typeof Order>(() => Order, {
        mappedBy: "summary",
      }),
    }
  )
  .indexes([
    {
      name: "IDX_order_summary_order_id_version",
      on: ["order_id", "version"],
      unique: false,
      where: "deleted_at IS NULL",
    },
    {
      name: "IDX_order_summary_deleted_at",
      on: ["deleted_at"],
      unique: false,
      where: "deleted_at IS NOT NULL",
    },
  ])

export const OrderSummary = _OrderSummary
