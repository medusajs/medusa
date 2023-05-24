import {
  Customer,
  CustomerGroup,
  Discount,
  DraftOrder,
  GiftCard,
  Order,
  PriceList,
  Product,
  ProductCollection,
} from "@medusajs/medusa"

export type EntityMap = {
  // Details
  "product.details": Product
  "product_collection.details": ProductCollection
  "order.details": Order
  "draft_order.details": DraftOrder
  "customer.details": Customer
  "customer_group.details": CustomerGroup
  "discount.details": Discount
  "price_list.details": PriceList
  "gift_card.details": Product
  // List
  "product.list": undefined
  "product_collection.list": undefined
  "order.list": undefined
  "draft_order.list": undefined
  "customer.list": undefined
  "customer_group.list": undefined
  "discount.list": undefined
  "price_list.list": undefined
  "gift_card.list": undefined
  // Stub
  custom_gift_card: GiftCard
  // Login
  "login.before": undefined
  "login.after": undefined
}

export const PropKeyMap = {
  "product.details": "product",
  "product_collection.details": "productCollection",
  "order.details": "order",
  "draft_order.details": "draftOrder",
  "customer.details": "customer",
  "customer_group.details": "customerGroup",
  "discount.details": "discount",
  "price_list.details": "priceList",
  custom_gift_card: "giftCard",
}
