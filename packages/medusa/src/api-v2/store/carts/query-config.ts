export const defaultStoreCartFields = [
  "id",
  "currency_code",
  "email",
  "created_at",
  "updated_at",
  "deleted_at",
]

export const defaultStoreCartRelations = [
  "items",
  "shipping_address",
  "billing_address",
  "shipping_methods",
]

export const retrieveTransformQueryConfig = {
  defaultFields: defaultStoreCartFields,
  defaultRelations: defaultStoreCartRelations,
  isList: false,
}
