const LEGACY_ORDER_INJECTION_ZONES = [
  "order.details.before",
  "order.details.after",
  "order.details.side.before",
  "order.details.side.after",
  "order.list.before",
  "order.list.after",
] as const

const ORDER_INJECTION_ZONES = [
  "order.details",
  "order.details.side",
  "order.list",
] as const

const LEGACY_CUSTOMER_INJECTION_ZONES = [
  "customer.details.before",
  "customer.details.after",
  "customer.details.side.before",
  "customer.details.side.after",
  "customer.list.before",
  "customer.list.after",
] as const

const CUSTOMER_INJECTION_ZONES = [
  "customer.details",
  "customer.details.side",
  "customer.list",
] as const

const LEGACY_CUSTOMER_GROUP_INJECTION_ZONES = [
  "customer_group.details.before",
  "customer_group.details.after",
  "customer_group.list.before",
  "customer_group.list.after",
] as const

const CUSTOMER_GROUP_INJECTION_ZONES = [
  "customer_group.details",
  "customer_group.list",
] as const

const LEGACY_PRODUCT_INJECTION_ZONES = [
  "product.details.before",
  "product.details.after",
  "product.list.before",
  "product.list.after",
  "product.details.side.before",
  "product.details.side.after",
] as const

const PRODUCT_INJECTION_ZONES = [
  "product.details",
  "product.list",
  "product.details.side",
] as const

const LEGACY_PRODUCT_VARIANT_INJECTION_ZONES = [
  "product_variant.details.before",
  "product_variant.details.after",
  "product_variant.details.side.before",
  "product_variant.details.side.after",
] as const

const PRODUCT_VARIANT_INJECTION_ZONES = [
  "product_variant.details",
  "product_variant.details.side",
] as const

const LEGACY_PRODUCT_COLLECTION_INJECTION_ZONES = [
  "product_collection.details.before",
  "product_collection.details.after",
  "product_collection.list.before",
  "product_collection.list.after",
] as const

const PRODUCT_COLLECTION_INJECTION_ZONES = [
  "product_collection.details",
  "product_collection.list",
] as const

const LEGACY_PRODUCT_CATEGORY_INJECTION_ZONES = [
  "product_category.details.before",
  "product_category.details.after",
  "product_category.details.side.before",
  "product_category.details.side.after",
  "product_category.list.before",
  "product_category.list.after",
] as const

const PRODUCT_CATEGORY_INJECTION_ZONES = [
  "product_category.details",
  "product_category.details.side",
  "product_category.list",
] as const

const LEGACY_PRODUCT_OPTION_INJECTION_ZONES = [
  "product_option.details.before",
  "product_option.details.after",
  "product_option.details.side.before",
  "product_option.details.side.after",
  "product_option.list.before",
  "product_option.list.after",
] as const

const PRODUCT_OPTION_INJECTION_ZONES = [
  "product_option.details",
  "product_option.list",
] as const

const LEGACY_PRODUCT_OPTION_VALUE_INJECTION_ZONES = [
  "product_option_value.details.before",
  "product_option_value.details.after",
] as const

const PRODUCT_OPTION_VALUE_INJECTION_ZONES = [
  "product_option_value.details",
] as const

const LEGACY_SHIPPING_OPTION_TYPE_INJECTION_ZONES = [
  "shipping_option_type.details.before",
  "shipping_option_type.details.after",
  "shipping_option_type.list.before",
  "shipping_option_type.list.after",
] as const

const SHIPPING_OPTION_TYPE_INJECTION_ZONES = [
  "shipping_option_type.details",
  "shipping_option_type.list",
] as const

const LEGACY_PRODUCT_TYPE_INJECTION_ZONES = [
  "product_type.details.before",
  "product_type.details.after",
  "product_type.list.before",
  "product_type.list.after",
] as const

const PRODUCT_TYPE_INJECTION_ZONES = [
  "product_type.details",
  "product_type.list",
] as const

const LEGACY_PRODUCT_TAG_INJECTION_ZONES = [
  "product_tag.details.before",
  "product_tag.details.after",
  "product_tag.list.before",
  "product_tag.list.after",
] as const

const PRODUCT_TAG_INJECTION_ZONES = [
  "product_tag.details",
  "product_tag.list",
] as const

const LEGACY_PRICE_LIST_INJECTION_ZONES = [
  "price_list.details.before",
  "price_list.details.after",
  "price_list.details.side.before",
  "price_list.details.side.after",
  "price_list.list.before",
  "price_list.list.after",
] as const

const PRICE_LIST_INJECTION_ZONES = [
  "price_list.details",
  "price_list.details.side",
  "price_list.list",
] as const

const LEGACY_PROMOTION_INJECTION_ZONES = [
  "promotion.details.before",
  "promotion.details.after",
  "promotion.details.side.before",
  "promotion.details.side.after",
  "promotion.list.before",
  "promotion.list.after",
] as const

const PROMOTION_INJECTION_ZONES = [
  "promotion.details",
  "promotion.details.side",
  "promotion.list",
] as const

const LEGACY_CAMPAIGN_INJECTION_ZONES = [
  "campaign.details.before",
  "campaign.details.after",
  "campaign.details.side.before",
  "campaign.details.side.after",
  "campaign.list.before",
  "campaign.list.after",
] as const

const CAMPAIGN_INJECTION_ZONES = [
  "campaign.details",
  "campaign.details.side",
  "campaign.list",
] as const

const LEGACY_USER_INJECTION_ZONES = [
  "user.details.before",
  "user.details.after",
  "user.list.before",
  "user.list.after",
] as const

const USER_INJECTION_ZONES = ["user.details", "user.list"] as const

const LEGACY_STORE_INJECTION_ZONES = [
  "store.details.before",
  "store.details.after",
] as const

const STORE_INJECTION_ZONES = ["store.details"] as const

const LEGACY_PROFILE_INJECTION_ZONES = [
  "profile.details.before",
  "profile.details.after",
] as const

const PROFILE_INJECTION_ZONES = ["profile.details"] as const

const LEGACY_REGION_INJECTION_ZONES = [
  "region.details.before",
  "region.details.after",
  "region.list.before",
  "region.list.after",
] as const

const REGION_INJECTION_ZONES = ["region.details", "region.list"] as const

const LEGACY_SHIPPING_PROFILE_INJECTION_ZONES = [
  "shipping_profile.details.before",
  "shipping_profile.details.after",
  "shipping_profile.list.before",
  "shipping_profile.list.after",
] as const

const SHIPPING_PROFILE_INJECTION_ZONES = [
  "shipping_profile.details",
  "shipping_profile.list",
] as const

const LEGACY_LOCATION_INJECTION_ZONES = [
  "location.details.before",
  "location.details.after",
  "location.details.side.before",
  "location.details.side.after",
  "location.list.before",
  "location.list.after",
  "location.list.side.before",
  "location.list.side.after",
] as const

const LOCATION_INJECTION_ZONES = [
  "location.details",
  "location.details.side",
  "location.list",
  "location.list.side",
] as const

const LOGIN_INJECTION_ZONES = ["login.before", "login.after"] as const

const LEGACY_SALES_CHANNEL_INJECTION_ZONES = [
  "sales_channel.details.before",
  "sales_channel.details.after",
  "sales_channel.list.before",
  "sales_channel.list.after",
] as const

const SALES_CHANNEL_INJECTION_ZONES = [
  "sales_channel.details",
  "sales_channel.list",
] as const

const LEGACY_RESERVATION_INJECTION_ZONES = [
  "reservation.details.before",
  "reservation.details.after",
  "reservation.details.side.before",
  "reservation.details.side.after",
  "reservation.list.before",
  "reservation.list.after",
] as const

const RESERVATION_INJECTION_ZONES = [
  "reservation.details",
  "reservation.details.side",
  "reservation.list",
] as const

const LEGACY_API_KEY_INJECTION_ZONES = [
  "api_key.details.before",
  "api_key.details.after",
  "api_key.list.before",
  "api_key.list.after",
] as const

const API_KEY_INJECTION_ZONES = ["api_key.details", "api_key.list"] as const

const LEGACY_WORKFLOW_INJECTION_ZONES = [
  "workflow.details.before",
  "workflow.details.after",
  "workflow.list.before",
  "workflow.list.after",
] as const

const WORKFLOW_INJECTION_ZONES = ["workflow.details", "workflow.list"] as const

const LEGACY_TAX_INJECTION_ZONES = [
  "tax.details.before",
  "tax.details.after",
  "tax.list.before",
  "tax.list.after",
] as const

const TAX_INJECTION_ZONES = ["tax.details", "tax.list"] as const

const LEGACY_RETURN_REASON_INJECTION_ZONES = [
  "return_reason.list.before",
  "return_reason.list.after",
] as const

const RETURN_REASON_INJECTION_ZONES = ["return_reason.list"] as const

const LEGACY_REFUND_REASON_INJECTION_ZONES = [
  "refund_reason.list.before",
  "refund_reason.list.after",
] as const

const REFUND_REASON_INJECTION_ZONES = ["refund_reason.list"] as const

const LEGACY_INVENTORY_ITEM_INJECTION_ZONES = [
  "inventory_item.details.before",
  "inventory_item.details.after",
  "inventory_item.details.side.before",
  "inventory_item.details.side.after",
  "inventory_item.list.before",
  "inventory_item.list.after",
] as const

const INVENTORY_ITEM_INJECTION_ZONES = [
  "inventory_item.details",
  "inventory_item.details.side",
  "inventory_item.list",
] as const

const LEGACY_ROLE_INJECTION_ZONES = [
  "role.details.before",
  "role.details.after",
  "role.list.before",
  "role.list.after",
] as const

const ROLE_INJECTION_ZONES = ["role.details", "role.list"] as const

const LEGACY_POLICY_INJECTION_ZONES = [
  "policy.details.before",
  "policy.details.after",
  "policy.list.before",
  "policy.list.after",
] as const

const POLICY_INJECTION_ZONES = ["policy.details", "policy.list"] as const

const LEGACY_DRAFT_ORDER_INJECTION_ZONES = [
  "draft_order.details.before",
  "draft_order.details.after",
  "draft_order.details.side.before",
  "draft_order.details.side.after",
  "draft_order.list.before",
  "draft_order.list.after",
] as const

const DRAFT_ORDER_INJECTION_ZONES = [
  "draft_order.details",
  "draft_order.details.side",
  "draft_order.list",
] as const

const LEGACY_STORE_CREDIT_ACCOUNT_INJECTION_ZONES = [
  "store_credit_account.details.before",
  "store_credit_account.details.after",
  "store_credit_account.details.side.before",
  "store_credit_account.details.side.after",
  "store_credit_account.list.before",
  "store_credit_account.list.after",
] as const

const STORE_CREDIT_ACCOUNT_INJECTION_ZONES = [
  "store_credit_account.details",
  "store_credit_account.details.side",
  "store_credit_account.list",
] as const

const LEGACY_GIFT_CARD_INJECTION_ZONES = [
  "gift_card.details.before",
  "gift_card.details.after",
  "gift_card.details.side.before",
  "gift_card.details.side.after",
  "gift_card.list.before",
  "gift_card.list.after",
  "gift_card.list.side.before",
  "gift_card.list.side.after",
] as const

const GIFT_CARD_INJECTION_ZONES = [
  "gift_card.details",
  "gift_card.details.side",
  "gift_card.list",
] as const

const LEGACY_GIFT_CARD_PRODUCT_INJECTION_ZONES = [
  "gift_card_product.details.before",
  "gift_card_product.details.after",
  "gift_card_product.details.side.before",
  "gift_card_product.details.side.after",
  "gift_card_product.list.before",
  "gift_card_product.list.after",
] as const

const GIFT_CARD_PRODUCT_INJECTION_ZONES = [
  "gift_card_product.details",
  "gift_card_product.details.side",
  "gift_card_product.list",
] as const

/**
 * All valid injection zones in the admin panel. An injection zone is a specific place
 * in the admin panel where a plugin can inject custom widgets.
 */
export const INJECTION_ZONES = [
  ...LEGACY_ORDER_INJECTION_ZONES,
  ...ORDER_INJECTION_ZONES,
  ...LEGACY_CUSTOMER_INJECTION_ZONES,
  ...CUSTOMER_INJECTION_ZONES,
  ...LEGACY_CUSTOMER_GROUP_INJECTION_ZONES,
  ...CUSTOMER_GROUP_INJECTION_ZONES,
  ...LEGACY_PRODUCT_INJECTION_ZONES,
  ...PRODUCT_INJECTION_ZONES,
  ...LEGACY_PRODUCT_VARIANT_INJECTION_ZONES,
  ...PRODUCT_VARIANT_INJECTION_ZONES,
  ...LEGACY_PRODUCT_COLLECTION_INJECTION_ZONES,
  ...PRODUCT_COLLECTION_INJECTION_ZONES,
  ...LEGACY_PRODUCT_CATEGORY_INJECTION_ZONES,
  ...PRODUCT_CATEGORY_INJECTION_ZONES,
  ...LEGACY_PRODUCT_TYPE_INJECTION_ZONES,
  ...PRODUCT_TYPE_INJECTION_ZONES,
  ...LEGACY_PRODUCT_OPTION_INJECTION_ZONES,
  ...PRODUCT_OPTION_INJECTION_ZONES,
  ...LEGACY_PRODUCT_OPTION_VALUE_INJECTION_ZONES,
  ...PRODUCT_OPTION_VALUE_INJECTION_ZONES,
  ...LEGACY_SHIPPING_OPTION_TYPE_INJECTION_ZONES,
  ...SHIPPING_OPTION_TYPE_INJECTION_ZONES,
  ...LEGACY_PRODUCT_TAG_INJECTION_ZONES,
  ...PRODUCT_TAG_INJECTION_ZONES,
  ...LEGACY_PRICE_LIST_INJECTION_ZONES,
  ...PRICE_LIST_INJECTION_ZONES,
  ...LEGACY_PROMOTION_INJECTION_ZONES,
  ...PROMOTION_INJECTION_ZONES,
  ...LEGACY_USER_INJECTION_ZONES,
  ...USER_INJECTION_ZONES,
  ...LEGACY_STORE_INJECTION_ZONES,
  ...STORE_INJECTION_ZONES,
  ...LEGACY_PROFILE_INJECTION_ZONES,
  ...PROFILE_INJECTION_ZONES,
  ...LEGACY_REGION_INJECTION_ZONES,
  ...REGION_INJECTION_ZONES,
  ...LEGACY_SHIPPING_PROFILE_INJECTION_ZONES,
  ...SHIPPING_PROFILE_INJECTION_ZONES,
  ...LEGACY_LOCATION_INJECTION_ZONES,
  ...LOCATION_INJECTION_ZONES,
  ...LOGIN_INJECTION_ZONES,
  ...LEGACY_SALES_CHANNEL_INJECTION_ZONES,
  ...SALES_CHANNEL_INJECTION_ZONES,
  ...LEGACY_RESERVATION_INJECTION_ZONES,
  ...RESERVATION_INJECTION_ZONES,
  ...LEGACY_API_KEY_INJECTION_ZONES,
  ...API_KEY_INJECTION_ZONES,
  ...LEGACY_WORKFLOW_INJECTION_ZONES,
  ...WORKFLOW_INJECTION_ZONES,
  ...LEGACY_CAMPAIGN_INJECTION_ZONES,
  ...CAMPAIGN_INJECTION_ZONES,
  ...LEGACY_TAX_INJECTION_ZONES,
  ...TAX_INJECTION_ZONES,
  ...LEGACY_RETURN_REASON_INJECTION_ZONES,
  ...RETURN_REASON_INJECTION_ZONES,
  ...LEGACY_REFUND_REASON_INJECTION_ZONES,
  ...REFUND_REASON_INJECTION_ZONES,
  ...LEGACY_INVENTORY_ITEM_INJECTION_ZONES,
  ...INVENTORY_ITEM_INJECTION_ZONES,
  ...LEGACY_ROLE_INJECTION_ZONES,
  ...ROLE_INJECTION_ZONES,
  ...LEGACY_POLICY_INJECTION_ZONES,
  ...POLICY_INJECTION_ZONES,
  ...LEGACY_DRAFT_ORDER_INJECTION_ZONES,
  ...DRAFT_ORDER_INJECTION_ZONES,
  ...LEGACY_STORE_CREDIT_ACCOUNT_INJECTION_ZONES,
  ...STORE_CREDIT_ACCOUNT_INJECTION_ZONES,
  ...LEGACY_GIFT_CARD_INJECTION_ZONES,
  ...GIFT_CARD_INJECTION_ZONES,
  ...LEGACY_GIFT_CARD_PRODUCT_INJECTION_ZONES,
  ...GIFT_CARD_PRODUCT_INJECTION_ZONES,
] as const
