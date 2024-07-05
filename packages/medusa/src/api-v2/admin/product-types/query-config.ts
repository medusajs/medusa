export const defaultAdminProductTypeFields = [
  "id",
  "value",
  "created_at",
  "updated_at",
]

export const retrieveProductTypeTransformQueryConfig = {
  defaults: defaultAdminProductTypeFields,
  isList: false,
}

export const listProductTypesTransformQueryConfig = {
  ...retrieveProductTypeTransformQueryConfig,
  defaultLimit: 20,
  isList: true,
}
