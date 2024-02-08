export const defaultAdminUserRelations = []
export const allowedAdminUserRelations = []
export const defaultAdminUserFields = [
  "id",
  "first_name",
  "last_name",
  "email",
  "avatar_url",
  "metadata",
  "created_at",
  "updated_at",
  "deleted_at",
]

export const retrieveTransformQueryConfig = {
  defaultFields: defaultAdminUserFields,
  defaultRelations: defaultAdminUserRelations,
  allowedRelations: allowedAdminUserRelations,
  isList: false,
}

export const listTransformQueryConfig = {
  ...retrieveTransformQueryConfig,
  isList: true,
}
