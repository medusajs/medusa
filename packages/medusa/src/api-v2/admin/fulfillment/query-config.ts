export const defaultAdminShippingOptionFields = [
  "id",
  "name",
  "price_type",
  "data",
  "metadata",
  "created_at",
  "updated_at",
  "*rules",
  "*type",
  "*prices",
  "*service_zone",
  "*shipping_profile",
  "*provider",
]

export const retrieveTransformQueryConfig = {
  defaults: defaultAdminShippingOptionFields,
  isList: false,
}

export const listTransformQueryConfig = {
  ...retrieveTransformQueryConfig,
  isList: true,
}
