import { model, OrderChangeStatus } from "@medusajs/framework/utils"
import { Order } from "./order"
import { OrderChangeAction } from "./order-change-action"

const _OrderChange = model
  .define("OrderChange", {
    id: model.id({ prefix: "ordch" }).primaryKey(),
    return_id: model.text().nullable(),
    claim_id: model.text().nullable(),
    exchange_id: model.text().nullable(),
    version: model.number(),
    change_type: model.text().nullable(),
    description: model.text().nullable(),
    status: model
      .enum(OrderChangeStatus)
      .default(OrderChangeStatus.PENDING)
      .nullable(),
    internal_note: model.text().nullable(),
    created_by: model.text().nullable(),
    requested_by: model.text().nullable(),
    requested_at: model.dateTime().nullable(),
    confirmed_by: model.text().nullable(),
    confirmed_at: model.dateTime().nullable(),
    declined_by: model.text().nullable(),
    declined_reason: model.text().nullable(),
    metadata: model.json().nullable(),
    declined_at: model.dateTime().nullable(),
    canceled_by: model.text().nullable(),
    canceled_at: model.dateTime().nullable(),
    /**
     * @since 2.12.0
     */
    carry_over_promotions: model.boolean().nullable(),
    order: model.belongsTo<() => typeof Order>(() => Order, {
      mappedBy: "changes",
    }),
    actions: model.hasMany<() => typeof OrderChangeAction>(
      () => OrderChangeAction
    ),
  })
  .cascades({
    delete: ["actions"],
  })
  .indexes([
    {
      name: "IDX_order_change_order_id",
      on: ["order_id"],
      unique: false,
      where: "deleted_at IS NULL",
    },
    {
      name: "IDX_order_change_return_id",
      on: ["return_id"],
      unique: false,
      where: "return_id IS NOT NULL AND deleted_at IS NULL",
    },
    {
      name: "IDX_order_change_claim_id",
      on: ["claim_id"],
      unique: false,
      where: "claim_id IS NOT NULL AND deleted_at IS NULL",
    },
    {
      name: "IDX_order_change_exchange_id",
      on: ["exchange_id"],
      unique: false,
      where: "exchange_id IS NOT NULL AND deleted_at IS NULL",
    },
    {
      name: "IDX_order_change_status",
      on: ["status"],
      unique: false,
      where: "deleted_at IS NULL",
    },
    {
      name: "IDX_order_change_deleted_at",
      on: ["deleted_at"],
      unique: false,
      where: "deleted_at IS NOT NULL",
    },
    {
      name: "IDX_order_change_version",
      on: ["order_id", "version"],
      unique: false,
      where: "deleted_at IS NULL",
    },
  ])

export const OrderChange = _OrderChange
