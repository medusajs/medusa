export const defaultAdminClaimFields = [
  "id",
  "type",
  "order_id",
  "exchange_id",
  "claim_id",
  "display_id",
  "location_id",
  "order_version",
  "status",
  "refund_amount",
  "created_at",
  "updated_at",
]

export const defaultAdminDetailsClaimFields = [
  ...defaultAdminClaimFields,
  "items.*",
  "items.reason.*",
]

export const retrieveTransformQueryConfig = {
  defaultFields: defaultAdminDetailsClaimFields,
  isList: false,
}

export const listTransformQueryConfig = {
  defaults: defaultAdminClaimFields,
  defaultLimit: 20,
  isList: true,
}
