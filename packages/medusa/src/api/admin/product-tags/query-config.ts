export const defaultAdminProductTagFields = [
  "id",
  "value",
  "created_at",
  "updated_at",
]

export const retrieveProductTagTransformQueryConfig = {
  defaults: defaultAdminProductTagFields,
  isList: false,
}

export const listProductTagsTransformQueryConfig = {
  ...retrieveProductTagTransformQueryConfig,
  defaultLimit: 20,
  isList: true,
}
