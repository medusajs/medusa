export const defaultAdminClaimFields = [
  "id",
  "type",
  "order_id",
  "return_id",
  "display_id",
  "order_version",
  "refund_amount",
  "created_at",
  "updated_at",
  "canceled_at",
]

export const defaultAdminDetailsClaimFields = [
  ...defaultAdminClaimFields,
  "additional_items.*",
  "claim_items.*",
  "claim_items.reason.*",
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
