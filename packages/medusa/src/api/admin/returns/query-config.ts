export const defaultAdminReturnFields = [
  "id",
  "order_id",
  "exchange_id",
  "claim_id",
  "display_id",
  "order_version",
  "status",
  "refund_amount",
  "created_at",
  "updated_at",
]

export const retrieveTransformQueryConfig = {
  defaultFields: defaultAdminReturnFields,
  isList: false,
}

export const listTransformQueryConfig = {
  defaults: defaultAdminReturnFields,
  defaultLimit: 20,
  isList: true,
}
