export const defaultAdminShippingOptionRelations = ["rules"]
export const allowedAdminShippingOptionRelations = [
  ...defaultAdminShippingOptionRelations,
]
export const defaultAdminShippingOptionFields = [
  "id",
  "name",
  "price_type",
  "data",
  "metadata",
  "created_at",
  "updated_at",
  "rules.id",
  "rules.attribute",
  "rules.operator",
  "rules.value",
]

export const retrieveTransformQueryConfig = {
  defaultFields: defaultAdminShippingOptionFields,
  defaultRelations: defaultAdminShippingOptionRelations,
  allowedRelations: allowedAdminShippingOptionRelations,
  isList: false,
}

export const listTransformQueryConfig = {
  ...retrieveTransformQueryConfig,
  isList: true,
}
