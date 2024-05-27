const ORDER_INJECTION_ZONES = [
  "order.details.before",
  "order.details.after",
  "order.details.side.before",
  "order.details.side.after",
  "order.list.before",
  "order.list.after",
] as const

const DRAFT_ORDER_INJECTION_ZONES = [
  "draft_order.list.before",
  "draft_order.list.after",
  "draft_order.details.side.before",
  "draft_order.details.side.after",
  "draft_order.details.before",
  "draft_order.details.after",
] as const

const CUSTOMER_INJECTION_ZONES = [
  "customer.details.before",
  "customer.details.after",
  "customer.list.before",
  "customer.list.after",
] as const

const CUSTOMER_GROUP_INJECTION_ZONES = [
  "customer_group.details.before",
  "customer_group.details.after",
  "customer_group.list.before",
  "customer_group.list.after",
] as const

const PRODUCT_INJECTION_ZONES = [
  "product.details.before",
  "product.details.after",
  "product.list.before",
  "product.list.after",
  "product.details.side.before",
  "product.details.side.after",
] as const

const PRODUCT_COLLECTION_INJECTION_ZONES = [
  "product_collection.details.before",
  "product_collection.details.after",
  "product_collection.list.before",
  "product_collection.list.after",
] as const

const PRODUCT_CATEGORY_INJECTION_ZONES = [
  "product_category.details.before",
  "product_category.details.after",
  "product_category.details.side.before",
  "product_category.details.side.after",
  "product_category.list.before",
  "product_category.list.after",
] as const

const PRICE_LIST_INJECTION_ZONES = [
  "price_list.details.before",
  "price_list.details.after",
  "price_list.list.before",
  "price_list.list.after",
] as const

const DISCOUNT_INJECTION_ZONES = [
  "discount.details.before",
  "discount.details.after",
  "discount.list.before",
  "discount.list.after",
] as const

const PROMOTION_INJECTION_ZONES = [
  "promotion.details.before",
  "promotion.details.after",
  "promotion.list.before",
  "promotion.list.after",
] as const

const GIFT_CARD_INJECTION_ZONES = [
  "gift_card.details.before",
  "gift_card.details.after",
  "gift_card.list.before",
  "gift_card.list.after",
  "custom_gift_card.before",
  "custom_gift_card.after",
] as const

const LOGIN_INJECTION_ZONES = ["login.before", "login.after"] as const

/**
 * All valid injection zones in the admin panel. An injection zone is a specific place
 * in the admin panel where a plugin can inject custom widgets.
 */
export const INJECTION_ZONES = [
  ...ORDER_INJECTION_ZONES,
  ...DRAFT_ORDER_INJECTION_ZONES,
  ...CUSTOMER_INJECTION_ZONES,
  ...CUSTOMER_GROUP_INJECTION_ZONES,
  ...PRODUCT_INJECTION_ZONES,
  ...PRODUCT_COLLECTION_INJECTION_ZONES,
  ...PRODUCT_CATEGORY_INJECTION_ZONES,
  ...PRICE_LIST_INJECTION_ZONES,
  ...DISCOUNT_INJECTION_ZONES,
  ...PROMOTION_INJECTION_ZONES,
  ...GIFT_CARD_INJECTION_ZONES,
  ...LOGIN_INJECTION_ZONES,
] as const
