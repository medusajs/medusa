export const defaultAdminStoreFields = [
  "id",
  "name",
  "supported_currency_codes",
  "default_currency_code",
  "default_currency.name",
  "default_currency.symbol",
  "default_currency.symbol_native",
  "default_sales_channel_id",
  "default_region_id",
  "default_location_id",
  "metadata",
  "created_at",
  "updated_at",
]

export const retrieveTransformQueryConfig = {
  defaults: defaultAdminStoreFields,
  isList: false,
}

export const listTransformQueryConfig = {
  ...retrieveTransformQueryConfig,
  isList: true,
}
