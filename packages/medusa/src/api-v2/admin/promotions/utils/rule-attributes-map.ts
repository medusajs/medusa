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
    id: "buy_rules_min_quantity",
    value: "buy_rules_min_quantity",
    label: "Minimum quantity of items",
    required: true,
  },
  ...commonAttributes,
]

const targetRuleAttributes = [
  {
    id: "apply_to_quantity",
    value: "apply_to_quantity",
    label: "Quantity of items promotion will apply to",
    required: true,
  },
  ...commonAttributes,
]

export const ruleAttributesMap = {
  rules: ruleAttributes,
  "target-rules": targetRuleAttributes,
  "buy-rules": buyRuleAttributes,
}
