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
  defaults: defaultAdminUserFields,
  isList: false,
}

export const listTransformQueryConfig = {
  ...retrieveTransformQueryConfig,
  isList: true,
}
