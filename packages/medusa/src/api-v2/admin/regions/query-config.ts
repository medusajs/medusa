export const defaultAdminRegionFields = [
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
  defaults: defaultAdminRegionFields,
  isList: false,
}

export const listTransformQueryConfig = {
  defaults: defaultAdminRegionFields,
  defaultLimit: 20,
  isList: true,
}
