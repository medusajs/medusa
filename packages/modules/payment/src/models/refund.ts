import { model } from "@zjedene-medusa/framework/utils"
import Payment from "./payment"
import RefundReason from "./refund-reason"

const Refund = model
  .define("Refund", {
    id: model.id({ prefix: "ref" }).primaryKey(),
    amount: model.bigNumber(),
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
  ])

export default Refund
