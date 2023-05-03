import { Customer, Order, Product, ProductCollection } from "@medusajs/medusa"

export type EntityMap = {
  "product.details": Product
  "product_collection.details": ProductCollection
  "order.details": Order
  "customer.details": Customer
}

export type PropKeyMap = {
  "product.details": "product"
  "product_collection.details": "productCollection"
  "order.details": "order"
  "customer.details": "customer"
}
