export const defaultAdminRegionFields = [
  "id",
  "name",
  "currency_code",
  "created_at",
  "updated_at",
  "deleted_at",
  "metadata",
  "countries.id",
  "countries.iso_2",
  "countries.iso_3",
  "countries.num_code",
  "countries.name",
  "currency.code",
  "currency.symbol",
  "currency.symbol_native",
  "currency.name",
]

export const retrieveTransformQueryConfig = {
  defaultFields: defaultAdminRegionFields,
  isList: false,
}

export const listTransformQueryConfig = {
  ...retrieveTransformQueryConfig,
  isList: true,
}
