export const allowedAdminCollectionRelations = ["products.profiles"]

// TODO: See how these should look when expanded
export const defaultAdminCollectionRelations = ["products.profiles"]

export const defaultAdminCollectionFields = [
  "id",
  "title",
  "handle",
  "created_at",
  "updated_at",
]

export const retrieveTransformQueryConfig = {
  defaultFields: defaultAdminCollectionFields,
  defaultRelations: defaultAdminCollectionRelations,
  allowedRelations: allowedAdminCollectionRelations,
  isList: false,
}

export const listTransformQueryConfig = {
  ...retrieveTransformQueryConfig,
  defaultLimit: 10,
  isList: true,
}
