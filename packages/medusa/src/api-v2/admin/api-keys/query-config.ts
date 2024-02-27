export const defaultAdminApiKeyRelations = []
export const allowedAdminApiKeyRelations = []
export const defaultAdminApiKeyFields = [
  "id",
  "title",
  "token",
  "redacted",
  "type",
  "last_used_at",
  "created_at",
  "created_by",
  "revoked_at",
  "revoked_by",
]

export const retrieveTransformQueryConfig = {
  defaultFields: defaultAdminApiKeyFields,
  defaultRelations: defaultAdminApiKeyRelations,
  allowedRelations: allowedAdminApiKeyRelations,
  isList: false,
}

export const listTransformQueryConfig = {
  defaultLimit: 20,
  isList: true,
}
