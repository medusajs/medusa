import { model } from "@medusajs/framework/utils"
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
    // Tracks capture attempts that are reserved (in flight to the provider)
    // or settled-but-failed (kept only as an idempotency-key reuse hint for
    // a retry of that same capture). A retry after an ambiguous provider
    // failure (e.g. a timeout) reuses the matching entry's key instead of
    // minting a new one, which could double-capture funds; a settled,
    // reserved entry still counts toward the authorized-amount guard so a
    // genuinely concurrent second capture is still rejected.
    pending_captures: model.json().nullable(),
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
