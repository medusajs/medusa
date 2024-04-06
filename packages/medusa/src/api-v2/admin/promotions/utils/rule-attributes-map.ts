export enum DisguisedRule {
  APPLY_TO_QUANTITY = "apply_to_quantity",
  BUY_RULES_MIN_QUANTITY = "buy_rules_min_quantity",
}

export const disguisedRulesMap = {
  [DisguisedRule.APPLY_TO_QUANTITY]: {
    relation: "application_method",
  },
  [DisguisedRule.BUY_RULES_MIN_QUANTITY]: {
    relation: "application_method",
  },
}

const ruleAttributes = [
  {
    id: "currency",
    value: "currency_code",
    label: "Currency code",
    required: true,
  },
  {
    id: "customer_group",
    value: "customer_group.id",
    label: "Customer Group",
    required: false,
  },
  {
    id: "region",
    value: "region.id",
    label: "Region",
    required: false,
  },
  {
    id: "country",
    value: "shipping_address.country_code",
    label: "Country",
    required: false,
  },
  {
    id: "sales_channel",
    value: "sales_channel.id",
    label: "Sales Channel",
    required: false,
  },
]

const commonAttributes = [
  {
    id: "product",
    value: "items.product.id",
    label: "Product",
    required: false,
  },
  {
    id: "product_category",
    value: "items.product.categories.id",
    label: "Product Category",
    required: false,
  },
  {
    id: "product_collection",
    value: "items.product.collection_id",
    label: "Product Collection",
    required: false,
  },
  {
    id: "product_type",
    value: "items.product.type_id",
    label: "Product Type",
    required: false,
  },
  {
    id: "product_tag",
    value: "items.product.tags.id",
    label: "Product Tag",
    required: false,
  },
]

const buyRuleAttributes = [
  {
    id: DisguisedRule.BUY_RULES_MIN_QUANTITY,
    value: DisguisedRule.BUY_RULES_MIN_QUANTITY,
    label: "Minimum quantity of items",
    field_type: "number",
    required: true,
    disguised: true,
  },
  ...commonAttributes,
]

const targetRuleAttributes = [
  {
    id: DisguisedRule.APPLY_TO_QUANTITY,
    value: DisguisedRule.APPLY_TO_QUANTITY,
    label: "Quantity of items promotion will apply to",
    field_type: "number",
    required: true,
    disguised: true,
  },
  ...commonAttributes,
]

export const ruleAttributesMap = {
  rules: ruleAttributes,
  "target-rules": targetRuleAttributes,
  "buy-rules": buyRuleAttributes,
}
