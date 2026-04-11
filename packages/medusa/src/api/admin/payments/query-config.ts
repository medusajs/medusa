export enum Entities {
  payment = "payment",
  capture = "capture",
  refund = "refund",
}

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
  "refunds.note",
  "refunds.payment_id",
  "refunds.refund_reason.label",
  "refunds.refund_reason.code",
]

export const listTransformQueryConfig = {
  defaults: defaultAdminPaymentFields,
  isList: true,
  entity: Entities.payment,
}

export const retrieveTransformQueryConfig = {
  defaults: defaultAdminPaymentFields,
  isList: false,
  entity: Entities.payment,
}

export const defaultAdminPaymentPaymentProviderFields = ["id", "is_enabled"]

export const listTransformPaymentProvidersQueryConfig = {
  defaults: defaultAdminPaymentPaymentProviderFields,
  isList: true,
}
