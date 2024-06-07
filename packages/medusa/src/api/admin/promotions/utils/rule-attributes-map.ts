import { PromotionType } from "@medusajs/utils"

export enum DisguisedRule {
  APPLY_TO_QUANTITY = "apply_to_quantity",
  BUY_RULES_MIN_QUANTITY = "buy_rules_min_quantity",
  CURRENCY_CODE = "currency_code",
}

const ruleAttributes = [
  {
    id: DisguisedRule.CURRENCY_CODE,
    value: DisguisedRule.CURRENCY_CODE,
    label: "Currency Code",
    field_type: "select",
    required: true,
    disguised: true,
    hydrate: true,
  },
  {
    id: "customer_group",
    value: "customer.groups.id",
    label: "Customer Group",
    required: false,
    field_type: "multiselect",
  },
  {
    id: "region",
    value: "region.id",
    label: "Region",
    required: false,
    field_type: "multiselect",
  },
  {
    id: "country",
    value: "shipping_address.country_code",
    label: "Country",
    required: false,
    field_type: "multiselect",
  },
  {
    id: "sales_channel",
    value: "sales_channel_id",
    label: "Sales Channel",
    required: false,
    field_type: "multiselect",
  },
]

const commonAttributes = [
  {
    id: "product",
    value: "items.product.id",
    label: "Product",
    required: false,
    field_type: "multiselect",
  },
  {
    id: "product_category",
    value: "items.product.categories.id",
    label: "Product Category",
    required: false,
    field_type: "multiselect",
  },
  {
    id: "product_collection",
    value: "items.product.collection_id",
    label: "Product Collection",
    required: false,
    field_type: "multiselect",
  },
  {
    id: "product_type",
    value: "items.product.type_id",
    label: "Product Type",
    required: false,
    field_type: "multiselect",
  },
  {
    id: "product_tag",
    value: "items.product.tags.id",
    label: "Product Tag",
    required: false,
    field_type: "multiselect",
  },
]

const buyGetBuyRules = [
  {
    id: DisguisedRule.BUY_RULES_MIN_QUANTITY,
    value: DisguisedRule.BUY_RULES_MIN_QUANTITY,
    label: "Minimum quantity of items",
    field_type: "number",
    required: true,
    disguised: true,
  },
]

const buyGetTargetRules = [
  {
    id: DisguisedRule.APPLY_TO_QUANTITY,
    value: DisguisedRule.APPLY_TO_QUANTITY,
    label: "Quantity of items promotion will apply to",
    field_type: "number",
    required: true,
    disguised: true,
  },
]

export const getRuleAttributesMap = (promotionType?: string) => {
  const map = {
    rules: [...ruleAttributes],
    "target-rules": [...commonAttributes],
    "buy-rules": [...commonAttributes],
  }

  if (promotionType === PromotionType.BUYGET) {
    map["buy-rules"].push(...buyGetBuyRules)
    map["target-rules"].push(...buyGetTargetRules)
  }

  return map
}
