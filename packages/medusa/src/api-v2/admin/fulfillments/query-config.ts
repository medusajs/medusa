export const defaultAdminFulfillmentsFields = [
  "id",
  "location_id",
  "packed_at",
  "shipped_at",
  "delivered_at",
  "canceled_at",
  "data",
  "provider_id",
  "shipping_option_id",
  "metadata",
  "order",
  "created_at",
  "updated_at",
  "deleted_at",
  "*delivery_address",
  "*items",
  "*labels",
]

export const retrieveTransformQueryConfig = {
  defaults: defaultAdminFulfillmentsFields,
  isList: false,
}

export const listTransformQueryConfig = {
  ...retrieveTransformQueryConfig,
  isList: true,
}
