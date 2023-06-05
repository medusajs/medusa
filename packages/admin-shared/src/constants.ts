export const extensionTypes = ["widget", "route", "nested-route"] as const

export const injectionZones = [
  // Order injection zones
  "order.details.before",
  "order.details.after",
  "order.list.before",
  "order.list.after",
  // Draft order injection zones
  "draft_order.list",
  "draft_order.details",
  // Customer injection zones
  "customer.details",
  "customer.list",
  // Customer group injection zones
  "customer_group.details",
  "customer_group.list",
  // Product injection zones
  "product.details.before",
  "product.details.after",
  "product.list.before",
  "product.list.after",
  // Product collection injection zones
  "product_collection.details",
  "product_collection.list",
  // Price list injection zones
  "price_list.details",
  "price_list.list",
  // Discount injection zones
  "discount.details",
  "discount.list",
  // Gift card injection zones
  "gift_card.details",
  "gift_card.list",
  "custom_gift_card",
  // Login
  "login.before",
  "login.after",
] as const
