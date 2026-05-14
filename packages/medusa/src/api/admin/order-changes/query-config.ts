export enum Entities {
  order_change = "order_change",
}

export const defaultAdminRetrieveOrderChangeFields = [
  "id",
  "order_id",
  "return_id",
  "claim_id",
  "exchange_id",
  "version",
  "change_type",
  "*actions",
  "description",
  "status",
  "internal_note",
  "created_by",
  "requested_by",
  "requested_at",
  "confirmed_by",
  "confirmed_at",
  "declined_by",
  "declined_reason",
  "metadata",
  "declined_at",
  "canceled_by",
  "canceled_at",
  "created_at",
  "updated_at",
  "carry_over_promotions",
]

export const retrieveTransformQueryConfig = {
  defaults: defaultAdminRetrieveOrderChangeFields,
  isList: false,
  entity: Entities.order_change,
}
