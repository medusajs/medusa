export const defaultAdminOrderRelations = []
export const allowedAdminOrderRelations = []
export const defaultAdminOrderFields = [
  "id",
  "version",
  "items",
  "items.detail",
  "metadata",
  "created_at",
  "updated_at",
]

export const retrieveTransformQueryConfig = {
  defaultFields: defaultAdminOrderFields,
  defaultRelations: defaultAdminOrderRelations,
  allowedRelations: allowedAdminOrderRelations,
  isList: false,
}

export const listTransformQueryConfig = {
  defaultLimit: 20,
  isList: true,
}
