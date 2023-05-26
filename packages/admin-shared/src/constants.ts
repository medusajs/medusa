export const extensionTypes = ["widget", "route", "nested-route"] as const

export const injectionZones = [
  // Order injection zones
  "order.details",
  "order.list",
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
  "product.details",
  "product.list",
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
] as const
