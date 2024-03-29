export const defaultAdminCustomerGroupRelations = []
export const allowedAdminCustomerGroupRelations = ["customers"]
export const defaultAdminCustomerGroupFields = [
  "id",
  "name",
  "created_at",
  "updated_at",
  "deleted_at",
]

export const retrieveTransformQueryConfig = {
  defaultFields: defaultAdminCustomerGroupFields,
  defaultRelations: defaultAdminCustomerGroupRelations,
  allowedRelations: allowedAdminCustomerGroupRelations,
  isList: false,
}

export const listTransformQueryConfig = {
  ...retrieveTransformQueryConfig,
  isList: true,
}
