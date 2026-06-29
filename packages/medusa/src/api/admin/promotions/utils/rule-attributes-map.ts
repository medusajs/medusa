import {
  ApplicationMethodTargetType,
  ApplicationMethodType,
  PromotionType,
  RuleOperator,
} from "@zjedene-medusa/framework/utils"
import { numericOperatorsMap, operatorsMap } from "./operators-map"
import {
  ApplicationMethodTargetTypeValues,
  ApplicationMethodTypeValues,
  PromotionTypeValues,
} from "@zjedene-medusa/types"

export enum DisguisedRule {
  APPLY_TO_QUANTITY = "apply_to_quantity",
  BUY_RULES_MIN_QUANTITY = "buy_rules_min_quantity",
  CURRENCY_CODE = "currency_code",
}

const ruleAttributes = [
  {
    id: "customer_group",
    value: "customer.groups.id",
    label: "Customer Group",
    required: false,
    field_type: "multiselect",
    operators: Object.values(operatorsMap),
  },
  {
    id: "region",
    value: "region.id",
    label: "Region",
    required: false,
    field_type: "multiselect",
    operators: Object.values(operatorsMap),
  },
  {
    id: "country",
    value: "shipping_address.country_code",
    label: "Country",
    required: false,
    field_type: "multiselect",
    operators: Object.values(operatorsMap),
  },
  {
    id: "sales_channel",
    value: "sales_channel_id",
    label: "Sales Channel",
    required: false,
    field_type: "multiselect",
    operators: Object.values(operatorsMap),
  },
  {
    id: "total",
    value: "total",
    label: "Cart Total",
    required: false,
    field_type: "number",
    operators: Object.values(numericOperatorsMap),
  },
  {
    id: "city",
    value: "shipping_address.city",
    label: "Shipping City",
    required: false,
    field_type: "text",
    operators: Object.values(operatorsMap),
  },
  {
    id: "customer_order_count",
    value: "customer_order_count",
    label: "Customer Order Count",
    required: false,
    field_type: "number",
    operators: Object.values(numericOperatorsMap),
  },
  {
    id: "is_logged_in",
    value: "is_logged_in",
    label: "Customer Logged In",
    required: false,
    field_type: "select",
    operators: [operatorsMap[RuleOperator.EQ]],
  },
  {
    id: "current_day_of_week",
    value: "current_day_of_week",
    label: "Day of Week",
    required: false,
    field_type: "multiselect",
    operators: [operatorsMap[RuleOperator.IN]],
  },
  {
    id: "current_minutes",
    value: "current_minutes",
    label: "Time of Day (minutes since midnight)",
    required: false,
    field_type: "number",
    operators: Object.values(numericOperatorsMap),
  },
]

const itemsAttributes = [
  {
    id: "product",
    value: "items.product.id",
    label: "Product",
    required: false,
    field_type: "multiselect",
    operators: Object.values(operatorsMap),
  },
  {
    id: "product_category",
    value: "items.product.categories.id",
    label: "Product Category",
    required: false,
    field_type: "multiselect",
    operators: Object.values(operatorsMap),
  },
  {
    id: "product_collection",
    value: "items.product.collection_id",
    label: "Product Collection",
    required: false,
    field_type: "multiselect",
    operators: Object.values(operatorsMap),
  },
  {
    id: "product_type",
    value: "items.product.type_id",
    label: "Product Type",
    required: false,
    field_type: "multiselect",
    operators: Object.values(operatorsMap),
  },
  {
    id: "product_tag",
    value: "items.product.tags.id",
    label: "Product Tag",
    required: false,
    field_type: "multiselect",
    operators: Object.values(operatorsMap),
  },
  {
    id: "box_type",
    value: "items.product.metadata.box_type",
    label: "Box Type",
    required: false,
    field_type: "text",
    operators: Object.values(operatorsMap),
  },
]

const shippingMethodsAttributes = [
  {
    id: "shipping_option_type",
    value: "shipping_methods.shipping_option.shipping_option_type_id",
    label: "Shipping Option Type",
    required: false,
    field_type: "multiselect",
    operators: Object.values(operatorsMap),
  },
]

const currencyRule = {
  id: DisguisedRule.CURRENCY_CODE,
  value: DisguisedRule.CURRENCY_CODE,
  label: "Currency Code",
  field_type: "select",
  required: true,
  disguised: true,
  hydrate: true,
  operators: [operatorsMap[RuleOperator.EQ]],
}

const buyGetBuyRules = [
  {
    id: DisguisedRule.BUY_RULES_MIN_QUANTITY,
    value: DisguisedRule.BUY_RULES_MIN_QUANTITY,
    label: "Minimum quantity of items",
    field_type: "number",
    required: true,
    disguised: true,
    operators: [operatorsMap[RuleOperator.EQ]],
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
    operators: [operatorsMap[RuleOperator.EQ]],
  },
]

export const getRuleAttributesMap = ({
  promotionType,
  applicationMethodType,
  applicationMethodTargetType,
}: {
  promotionType?: PromotionTypeValues
  applicationMethodType?: ApplicationMethodTypeValues
  applicationMethodTargetType?: ApplicationMethodTargetTypeValues
}) => {
  const map = {
    rules: [...ruleAttributes],
    "target-rules":
      applicationMethodTargetType ===
      ApplicationMethodTargetType.SHIPPING_METHODS
        ? [...shippingMethodsAttributes]
        : [...itemsAttributes],
    "buy-rules":
      applicationMethodTargetType ===
      ApplicationMethodTargetType.SHIPPING_METHODS
        ? [...shippingMethodsAttributes]
        : [...itemsAttributes],
  }

  if (applicationMethodType === ApplicationMethodType.FIXED) {
    map["rules"].push({ ...currencyRule })
  } else {
    map["rules"].push({ ...currencyRule, required: false })
  }

  if (promotionType === PromotionType.BUYGET) {
    map["buy-rules"].push(...buyGetBuyRules)
    map["target-rules"].push(...buyGetTargetRules)
  }

  return map
}
