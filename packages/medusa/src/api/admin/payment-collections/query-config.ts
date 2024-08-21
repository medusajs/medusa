export const defaultPaymentCollectionFields = [
  "id",
  "currency_code",
  "amount",
  "status",
  "authorized_amount",
  "captured_amount",
  "refunded_amount",
  "*payment_sessions",
  "*payments",
]

export const retrievePaymentCollectionTransformQueryConfig = {
  defaults: defaultPaymentCollectionFields,
  isList: false,
}
