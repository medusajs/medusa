export enum PriceListRelations {
  PRICES = "prices",
}

export const adminPriceListPriceRemoteQueryFields = [
  "id",
  "currency_code",
  "amount",
  "min_quantity",
  "max_quantity",
  "created_at",
  "deleted_at",
  "updated_at",
  "price_set.variant.id",
  "price_rules.value",
  "price_rules.rule_type.rule_attribute",
]

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
  "price_list_rules.price_list_rule_values.value",
  "price_list_rules.rule_type.rule_attribute",
  ...adminPriceListPriceRemoteQueryFields.map((field) => `prices.${field}`),
]

export const retrivePriceListPriceQueryConfig = {
  defaults: adminPriceListPriceRemoteQueryFields,
  isList: false,
}

export const listPriceListPriceQueryConfig = {
  ...retrivePriceListPriceQueryConfig,
  isList: true,
}

export const retrivePriceListQueryConfig = {
  defaults: adminPriceListRemoteQueryFields,
  isList: false,
}

export const listPriceListQueryConfig = {
  ...retrivePriceListQueryConfig,
  isList: true,
}
