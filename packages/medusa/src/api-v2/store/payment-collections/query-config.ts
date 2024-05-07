export const defaultPaymentCollectionFields = [
  "id",
  "currency_code",
  "amount",
  "*payment_sessions",
]

export const retrievePaymentCollectionTransformQueryConfig = {
  defaults: defaultPaymentCollectionFields,
  isList: false,
}
