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
  "refunds.payment_id",
]

export const listTransformQueryConfig = {
  defaults: defaultAdminPaymentFields,
  isList: true,
}

export const retrieveTransformQueryConfig = {
  defaults: defaultAdminPaymentFields,
  isList: false,
}

export const defaultAdminPaymentPaymentProviderFields = ["id", "is_enabled"]

export const listTransformPaymentProvidersQueryConfig = {
  defaults: defaultAdminPaymentPaymentProviderFields,
  isList: true,
}
