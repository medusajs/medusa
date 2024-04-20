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
  "created_at",
  "updated_at",
]

export const retrieveTransformQueryConfig = {
  defaults: defaultAdminFulfillmentsFields,
  isList: false,
}

export const listTransformQueryConfig = {
  ...retrieveTransformQueryConfig,
  isList: true,
}
