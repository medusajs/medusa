export enum Entities {
  product_type = "product_type",
}

export const defaultAdminProductTypeFields = [
  "id",
  "value",
  "created_at",
  "updated_at",
  "metadata",
]

export const retrieveProductTypeTransformQueryConfig = {
  defaults: defaultAdminProductTypeFields,
  isList: false,
  entity: Entities.product_type,
}

export const listProductTypesTransformQueryConfig = {
  ...retrieveProductTypeTransformQueryConfig,
  defaultLimit: 20,
  isList: true,
  entity: Entities.product_type,
}
