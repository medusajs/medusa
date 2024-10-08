export const defaultStoreRegionFields = [
  "id",
  "name",
  "currency_code",
  "created_at",
  "updated_at",
  "deleted_at",
  "metadata",
  "*countries",
]

export const retrieveTransformQueryConfig = {
  defaults: defaultStoreRegionFields,
  isList: false,
}

export const listTransformQueryConfig = {
  defaults: defaultStoreRegionFields,
  defaultLimit: 20,
  isList: true,
}
