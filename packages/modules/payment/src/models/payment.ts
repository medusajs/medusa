import { model } from "@zjedene-medusa/framework/utils"
import Capture from "./capture"
import PaymentCollection from "./payment-collection"
import PaymentSession from "./payment-session"
import Refund from "./refund"

// TODO: We should remove the `Payment` model and use the `PaymentSession` model instead.
// We just need to move the refunds, captures, canceled_at, and captured_at to it.
const Payment = model
  .define("Payment", {
    id: model.id({ prefix: "pay" }).primaryKey(),
    amount: model.bigNumber(),
    currency_code: model.text(),
    provider_id: model.text(),
    data: model.json().nullable(),
    metadata: model.json().nullable(),
    captured_at: model.dateTime().nullable(),
    canceled_at: model.dateTime().nullable(),
    payment_collection: model.belongsTo(() => PaymentCollection, {
      mappedBy: "payments",
    }),
    payment_session: model.belongsTo(() => PaymentSession, {
      mappedBy: "payment",
    }),
    refunds: model.hasMany(() => Refund, {
      mappedBy: "payment",
    }),
    captures: model.hasMany(() => Capture, {
      mappedBy: "payment",
    }),
  })
  .cascades({
    delete: ["refunds", "captures"],
  })
  .indexes([
    {
      name: "IDX_payment_provider_id",
      on: ["provider_id"],
    },
    {
      name: "IDX_payment_payment_collection_id",
      on: ["payment_collection_id"],
    },
    {
      name: "IDX_payment_payment_session_id",
      on: ["payment_session_id"],
    },
  ])

export default Payment
