import { model, PaymentSessionStatus } from "@zjedene-medusa/framework/utils"
import Payment from "./payment"
import PaymentCollection from "./payment-collection"

const PaymentSession = model
  .define("PaymentSession", {
    id: model.id({ prefix: "payses" }).primaryKey(),
    currency_code: model.text(),
    amount: model.bigNumber(),
    provider_id: model.text(),
    data: model.json().default({}),
    context: model.json().nullable(),
    status: model
      .enum(PaymentSessionStatus)
      .default(PaymentSessionStatus.PENDING),
    authorized_at: model.dateTime().nullable(),
    payment_collection: model.belongsTo<() => typeof PaymentCollection>(
      () => PaymentCollection,
      {
        mappedBy: "payment_sessions",
      }
    ),
    payment: model
      .hasOne(() => Payment, {
        mappedBy: "payment_session",
      })
      .nullable(),
    metadata: model.json().nullable(),
  })
  .indexes([
    {
      name: "IDX_payment_session_payment_collection_id",
      on: ["payment_collection_id"],
    },
  ])

export default PaymentSession
