export const defaultAdminExchangeFields = [
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

export const defaultAdminDetailsExchangeFields = [
  ...defaultAdminExchangeFields,
  "additional_items.*",
]

export const retrieveTransformQueryConfig = {
  defaultFields: defaultAdminDetailsExchangeFields,
  isList: false,
}

export const listTransformQueryConfig = {
  defaults: defaultAdminExchangeFields,
  defaultLimit: 20,
  isList: true,
}
