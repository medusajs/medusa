export const defaultStoreRegionFields = [
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
  isList: false,
}

export const listTransformQueryConfig = {
  defaultLimit: 20,
  isList: true,
}
