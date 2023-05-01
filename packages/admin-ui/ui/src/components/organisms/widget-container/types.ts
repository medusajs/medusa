import {
  Customer,
  CustomerGroup,
  Order,
  PriceList,
  Product,
  ProductCategory,
  ProductCollection,
} from "@medusajs/medusa"

export type EntityMap = {
  "product.details": Product
  "product_category.details": ProductCategory
  "product_collection.details": ProductCollection
  "order.details": Order
  "customer.details": Customer
  "customer_group.details": CustomerGroup
  "price_list.details": PriceList
}

export type PropKeyMap = {
  "product.details": "product"
  "product_category.details": "productCategory"
  "product_collection.details": "productCollection"
  "order.details": "order"
  "customer.details": "customer"
  "customer_group.details": "customerGroup"
  "price_list.details": "priceList"
}
