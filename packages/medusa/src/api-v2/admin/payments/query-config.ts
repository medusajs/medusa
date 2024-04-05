export const defaultAdminPaymentFields = [
  "id",
  "currency_code",
  "amount",
  "captured_at",
  "payment_collection_id",
  "payment_session_id",
  "captures.id",
  "captures.amount",
  "refunds.id",
  "refunds.amount",
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

export const defaultAdminPaymentPaymentProviderFields = ["id", "is_enabled"]

export const listTransformPaymentProvidersQueryConfig = {
  defaultFields: defaultAdminPaymentPaymentProviderFields,
  defaultRelations: [],
  allowedRelations: [],
  isList: true,
}
