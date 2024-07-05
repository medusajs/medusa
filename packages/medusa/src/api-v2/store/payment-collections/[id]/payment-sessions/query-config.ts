export const defaultStorePaymentCollectionFields = [
  "id",
  "currency_code",
  "amount",
  "payment_sessions",
  "payment_sessions.id",
  "payment_sessions.amount",
  "payment_sessions.provider_id",
]

export const defaultStorePaymentCollectionRelations = ["payment_sessions"]

export const allowedStorePaymentCollectionRelations = ["payment_sessions"]

export const retrieveTransformQueryConfig = {
  defaultFields: defaultStorePaymentCollectionFields,
  defaultRelations: defaultStorePaymentCollectionRelations,
  allowedRelations: allowedStorePaymentCollectionRelations,
  isList: false,
}
