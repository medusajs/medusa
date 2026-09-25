import { model, RefundStatus } from "@medusajs/framework/utils"
import Payment from "./payment"
import RefundReason from "./refund-reason"

const Refund = model
  .define("Refund", {
    id: model.id({ prefix: "ref" }).primaryKey(),
    amount: model.bigNumber(),
    status: model.enum(RefundStatus).default(RefundStatus.PENDING),
    idempotency_key: model.text().nullable(),
    payment: model.belongsTo(() => Payment, {
      mappedBy: "refunds",
    }),
    refund_reason: model
      .belongsTo(() => RefundReason, {
        mappedBy: "refunds",
      })
      .nullable(),
    note: model.text().nullable(),
    created_by: model.text().nullable(),
    metadata: model.json().nullable(),
  })
  .indexes([
    {
      name: "IDX_refund_payment_id",
      on: ["payment_id"],
    },
    {
      name: "IDX_refund_payment_id_idempotency_key_unique",
      on: ["payment_id", "idempotency_key"],
      unique: true,
      where: "idempotency_key IS NOT NULL",
    },
  ])

export default Refund
