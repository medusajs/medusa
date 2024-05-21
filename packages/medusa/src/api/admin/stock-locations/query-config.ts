export const defaultAdminStockLocationFields = [
  "id",
  "name",
  "metadata",
  "created_at",
  "updated_at",
  "address.id",
  "address.address_1",
  "address.address_2",
  "address.city",
  "address.country_code",
  "address.phone",
  "address.province",
  "address.postal_code",
  "address.metadata",
]

export const retrieveTransformQueryConfig = {
  defaults: defaultAdminStockLocationFields,
  isList: false,
}

export const listTransformQueryConfig = {
  ...retrieveTransformQueryConfig,
  isList: true,
}
