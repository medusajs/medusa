export enum PriceListRelations {
  CUSTOMER_GROUPS = "customer_groups",
  PRICES = "prices",
}

export const priceListRemoteQueryFields = {
  fields: [
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
  ],
  pricesFields: [
    "price_set_money_amounts.money_amount.id",
    "price_set_money_amounts.money_amount.currency_code",
    "price_set_money_amounts.money_amount.amount",
    "price_set_money_amounts.money_amount.min_quantity",
    "price_set_money_amounts.money_amount.max_quantity",
    "price_set_money_amounts.money_amount.created_at",
    "price_set_money_amounts.money_amount.deleted_at",
    "price_set_money_amounts.money_amount.updated_at",
    "price_set_money_amounts.price_set.variant.id",
    "price_set_money_amounts.price_rules.value",
    "price_set_money_amounts.price_rules.rule_type.rule_attribute",
  ],
  customerGroupsFields: [
    "price_list_rules.price_list_rule_values.value",
    "price_list_rules.rule_type.rule_attribute",
    "price_set_money_amounts.price_rules.value",
    "price_set_money_amounts.price_rules.rule_type.rule_attribute",
  ],
}

export const defaultAdminPriceListFields = [
  ...priceListRemoteQueryFields.fields,
  "name",
]

export const defaultAdminPriceListRelations = []

export const allowedAdminPriceListRelations = [
  PriceListRelations.CUSTOMER_GROUPS,
  PriceListRelations.PRICES,
]

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
