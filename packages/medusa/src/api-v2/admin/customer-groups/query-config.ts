export const defaultAdminCustomerGroupFields = [
  "id",
  "name",
  "created_by",
  "created_at",
  "updated_at",
  "deleted_at",
]

export const retrieveTransformQueryConfig = {
  defaults: defaultAdminCustomerGroupFields,
  isList: false,
}

export const listTransformQueryConfig = {
  ...retrieveTransformQueryConfig,
  isList: true,
}
