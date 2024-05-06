export const defaultPaymentCollectionFields = [
  "id",
  "currency_code",
  "amount",
  "payment_sessions",
  "payment_sessions.id",
  "payment_sessions.amount",
  "payment_sessions.provider_id",
]

export const retrievePaymentCollectionTransformQueryConfig = {
  defaults: defaultPaymentCollectionFields,
  isList: false,
}
