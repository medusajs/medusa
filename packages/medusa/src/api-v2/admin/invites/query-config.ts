export const defaultAdminInviteRelations = []
export const allowedAdminInviteRelations = []
export const defaultAdminInviteFields = [
  "id",
  "email",
  "accepted",
  "token",
  "expires_at",
  "metadata",
  "created_at",
  "updated_at",
  "deleted_at",
]

export const retrieveTransformQueryConfig = {
  defaultFields: defaultAdminInviteFields,
  defaultRelations: defaultAdminInviteRelations,
  allowedRelations: allowedAdminInviteRelations,
  isList: false,
}

export const listTransformQueryConfig = {
  ...retrieveTransformQueryConfig,
  isList: true,
}
