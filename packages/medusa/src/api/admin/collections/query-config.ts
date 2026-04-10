export enum Entities {
  product_collection = "product_collection",
}

export const defaultAdminCollectionFields = [
  "id",
  "title",
  "handle",
  "created_at",
  "updated_at",
  "metadata",
]

export const retrieveTransformQueryConfig = {
  defaults: defaultAdminCollectionFields,
  isList: false,
  entity: Entities.product_collection,
}

export const listTransformQueryConfig = {
  ...retrieveTransformQueryConfig,
  defaultLimit: 10,
  isList: true,
  entity: Entities.product_collection,
}
