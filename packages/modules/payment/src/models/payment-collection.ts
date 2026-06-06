import { model, PaymentCollectionStatus } from "@zjedene-medusa/framework/utils"
import Payment from "./payment"
import PaymentProvider from "./payment-provider"
import PaymentSession from "./payment-session"

const PaymentCollection = model
  .define("PaymentCollection", {
    id: model.id({ prefix: "pay_col" }).primaryKey(),
    currency_code: model.text(),
    amount: model.bigNumber(),
    authorized_amount: model.bigNumber().nullable(),
    captured_amount: model.bigNumber().nullable(),
    refunded_amount: model.bigNumber().nullable(),
    completed_at: model.dateTime().nullable(),
    status: model
      .enum(PaymentCollectionStatus)
      .default(PaymentCollectionStatus.NOT_PAID),
    metadata: model.json().nullable(),
    payment_providers: model.manyToMany(() => PaymentProvider, {
      mappedBy: "payment_collections",
    }),
    payment_sessions: model.hasMany(() => PaymentSession, {
      mappedBy: "payment_collection",
    }),
    payments: model.hasMany(() => Payment, {
      mappedBy: "payment_collection",
    }),
  })
  .cascades({
    delete: ["payment_sessions", "payments"],
  })

export default PaymentCollection
