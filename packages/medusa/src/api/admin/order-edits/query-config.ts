export const defaultAdminOrderEditFields = [
  "id",
  "type",
  "order_id",
  "return_id",
  "display_id",
  "order_version",
  "created_at",
  "updated_at",
  "canceled_at",
]

export const defaultAdminDetailsOrderEditFields = [
  ...defaultAdminOrderEditFields,
  "additional_items.*",
]

export const retrieveTransformQueryConfig = {
  defaultFields: defaultAdminDetailsOrderEditFields,
  isList: false,
}

export const listTransformQueryConfig = {
  defaults: defaultAdminOrderEditFields,
  defaultLimit: 20,
  isList: true,
}
