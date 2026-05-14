export enum Entities {
  order_claim = "order_claim",
}

export const defaultAdminClaimFields = [
  "id",
  "type",
  "order_id",
  "return_id",
  "display_id",
  "order_version",
  "refund_amount",
  "created_by",
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
  defaults: defaultAdminDetailsClaimFields,
  isList: false,
  entity: Entities.order_claim,
}

export const listTransformQueryConfig = {
  defaults: defaultAdminClaimFields,
  defaultLimit: 20,
  isList: true,
  entity: Entities.order_claim,
}
