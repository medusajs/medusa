export const defaultAdminOrderEditFields = [
  "id",
  "order_id",
  "display_id",
  "order_version",
  "created_at",
  "updated_at",
  "canceled_at",
]

export const defaultAdminDetailsOrderEditFields = [
  ...defaultAdminOrderEditFields,
]

export const retrieveTransformQueryConfig = {
  defaults: defaultAdminDetailsOrderEditFields,
  isList: false,
}

export const listTransformQueryConfig = {
  defaults: defaultAdminOrderEditFields,
  defaultLimit: 20,
  isList: true,
}
