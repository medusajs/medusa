export enum PriceListRelations {
  PRICES = "prices",
}

export const adminPriceListRemoteQueryFields = [
  "id",
  "type",
  "description",
  "title",
  "status",
  "starts_at",
  "ends_at",
  "created_at",
  "updated_at",
  "deleted_at",
  "prices.id",
  "prices.currency_code",
  "prices.amount",
  "prices.min_quantity",
  "prices.max_quantity",
  "prices.created_at",
  "prices.deleted_at",
  "prices.updated_at",
  "prices.price_set.variant.id",
  "prices.price_rules.value",
  "prices.price_rules.rule_type.rule_attribute",
  "price_list_rules.price_list_rule_values.value",
  "price_list_rules.rule_type.rule_attribute",
]

export const defaultAdminPriceListFields = [
  "id",
  "type",
  "description",
  "title",
  "status",
  "starts_at",
  "ends_at",
  "rules",
  "created_at",
  "updated_at",
  "prices.amount",
  "prices.id",
  "prices.currency_code",
  "prices.amount",
  "prices.min_quantity",
  "prices.max_quantity",
  "prices.variant_id",
  "prices.rules",
]

export const defaultAdminPriceListRelations = []
export const allowedAdminPriceListRelations = [PriceListRelations.PRICES]

export const adminListTransformQueryConfig = {
  defaultLimit: 50,
  defaultFields: defaultAdminPriceListFields,
  defaultRelations: defaultAdminPriceListRelations,
  allowedRelations: allowedAdminPriceListRelations,
  isList: true,
}

export const adminRetrieveTransformQueryConfig = {
  defaultFields: defaultAdminPriceListFields,
  defaultRelations: defaultAdminPriceListRelations,
  allowedRelations: allowedAdminPriceListRelations,
  isList: false,
}
