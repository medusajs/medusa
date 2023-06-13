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
  "product.details.after": Product
  "product.details.before": Product
  "product_collection.details.after": ProductCollection
  "product_collection.details.before": ProductCollection
  "order.details.after": Order
  "order.details.before": Order
  "draft_order.details.after": DraftOrder
  "draft_order.details.before": DraftOrder
  "customer.details.after": Customer
  "customer.details.before": Customer
  "customer_group.details.after": CustomerGroup
  "customer_group.details.before": CustomerGroup
  "discount.details.after": Discount
  "discount.details.before": Discount
  "price_list.details.after": PriceList
  "price_list.details.before": PriceList
  "gift_card.details.after": Product
  "gift_card.details.before": Product
  "custom_gift_card.after": GiftCard
  "custom_gift_card.before": GiftCard
  // List
  "product.list.after"?: never | null | undefined
  "product.list.before"?: never | null | undefined
  "product_collection.list.after"?: never | null | undefined
  "product_collection.list.before"?: never | null | undefined
  "order.list.after"?: never | null | undefined
  "order.list.before"?: never | null | undefined
  "draft_order.list.after"?: never | null | undefined
  "draft_order.list.before"?: never | null | undefined
  "customer.list.after"?: never | null | undefined
  "customer.list.before"?: never | null | undefined
  "customer_group.list.after"?: never | null | undefined
  "customer_group.list.before"?: never | null | undefined
  "discount.list.after"?: never | null | undefined
  "discount.list.before"?: never | null | undefined
  "price_list.list.after"?: never | null | undefined
  "price_list.list.before"?: never | null | undefined
  "gift_card.list.after"?: never | null | undefined
  "gift_card.list.before"?: never | null | undefined
  // Login
  "login.before"?: never | null | undefined
  "login.after"?: never | null | undefined
}

export const PropKeyMap = {
  "product.details.after": "product",
  "product.details.before": "product",
  "product_collection.details.after": "productCollection",
  "product_collection.details.before": "productCollection",
  "order.details.after": "order",
  "order.details.before": "order",
  "draft_order.details.after": "draftOrder",
  "draft_order.details.before": "draftOrder",
  "customer.details.after": "customer",
  "customer.details.before": "customer",
  "customer_group.details.after": "customerGroup",
  "customer_group.details.before": "customerGroup",
  "discount.details.after": "discount",
  "discount.details.before": "discount",
  "price_list.details.after": "priceList",
  "price_list.details.before": "priceList",
  custom_gift_card: "giftCard",
}
