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
