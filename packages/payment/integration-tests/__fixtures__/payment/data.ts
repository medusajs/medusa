export const defaultPaymentData = [
  {
    id: "pay-id-1",
    amount: 100,
    provider_id: "stripe",
    currency_code: "usd",
    session: { id: "session-1" },
    payment_collection: { id: "pay_col-1" },
    data: {
      data_key: "val",
    },
  },
  // {
  //   id: "pay-id-2",
  //   amount: 200,
  //   provider_id: "manual",
  //   currency_code: "eur",
  //   data: {},
  // },
  // {
  //   id: "pay-id-3",
  //   amount: 300,
  //   provider_id: "manual",
  //   currency_code: "usd",
  //   data: {},
  // },
]
