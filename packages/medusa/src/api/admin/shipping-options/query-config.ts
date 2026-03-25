export enum Entities {
  shipping_option = "shipping_option",
}

export const defaultAdminShippingOptionFields = [
  "id",
  "name",
  "price_type",
  "data",
  "provider_id",
  "metadata",
  "created_at",
  "updated_at",
  "*rules",
  "*type",
  "*prices",
  "*prices.price_rules",
  "*service_zone",
  "*shipping_profile",
  "*provider",
]

export const retrieveTransformQueryConfig = {
  defaults: defaultAdminShippingOptionFields,
  isList: false,
  entity: Entities.shipping_option,
}

export const listTransformQueryConfig = {
  ...retrieveTransformQueryConfig,
  isList: true,
  entity: Entities.shipping_option,
}

export const defaultAdminShippingOptionRuleFields = [
  "id",
  "description",
  "attribute",
  "operator",
  "values.value",
]

export const retrieveRuleTransformQueryConfig = {
  defaults: defaultAdminShippingOptionRuleFields,
  isList: false,
}

export const listRuleTransformQueryConfig = {
  ...retrieveRuleTransformQueryConfig,
  isList: true,
}
