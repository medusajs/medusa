import { prefixArrayItems } from "@medusajs/utils"
import { defaultAdminProductsVariantFields } from "../products/query-config"

export const defaultAdminPriceListFields = [
  "id",
  "created_at",
  "deleted_at",
  "description",
  "ends_at",
  "id",
  "title",
  "starts_at",
  "status",
  "type",
  "updated_at",
  "price_list_rules.price_list_rule_values.value",
  "price_list_rules.rule_type.rule_attribute",
  "price_set_money_amounts.money_amount.id",
  "price_set_money_amounts.money_amount.currency_code",
  "price_set_money_amounts.money_amount.amount",
  "price_set_money_amounts.money_amount.min_quantity",
  "price_set_money_amounts.money_amount.max_quantity",
  "price_set_money_amounts.money_amount.created_at",
  "price_set_money_amounts.money_amount.deleted_at",
  "price_set_money_amounts.money_amount.updated_at",
  "price_set_money_amounts.price_rules.value",
  "price_set_money_amounts.price_rules.rule_type.rule_attribute",
  ...prefixArrayItems(
    defaultAdminProductsVariantFields,
    "price_set_money_amounts.price_set.variant_link.variant."
  ),
]

export const defaultAdminPriceListRelations = [
  "price_list_rules",
  "price_list_rules.price_list_rule_values",
  "price_list_rules.rule_type",
  "price_set_money_amounts",
  "price_set_money_amounts.money_amounts",
  "price_set_money_amounts.price_rules",
  "price_set_money_amounts.rule_type",
  "price_set_money_amounts.price_set",
  "price_set_money_amounts.price_set.rule_type",
]

export const allowedAdminPriceListRelations = [
  ...defaultAdminPriceListRelations,
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
