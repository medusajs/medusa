export const defaultAdminPaymentFields = [
  "id",
  "currency_code",
  "amount",
  "payment_collection_id",
  "payment_session_id",
]

export const defaultAdminPaymentRelations = ["captures", "refunds"]

export const allowedAdminPaymentRelations = ["captures", "refunds"]

export const listTransformQueryConfig = {
  defaultFields: defaultAdminPaymentFields,
  defaultRelations: defaultAdminPaymentRelations,
  allowedRelations: allowedAdminPaymentRelations,
  isList: true,
}

export const retrieveTransformQueryConfig = {
  defaultFields: defaultAdminPaymentFields,
  defaultRelations: defaultAdminPaymentRelations,
  allowedRelations: allowedAdminPaymentRelations,
  isList: false,
}
