import { Router } from "express"
import middlewares from "../../../middlewares"

const route = Router()

export default app => {
  app.use("/orders", route)

  route.get("/:id", middlewares.wrap(require("./get-order").default))

  route.get(
    "/cart/:cart_id",
    middlewares.wrap(require("./get-order-by-cart").default)
  )

  return app
}

export const defaultRelations = [
  "shipping_address",
  "fulfillments",
  "items",
  "items.variant",
  "items.variant.product",
  "shipping_methods",
  "discounts",
  "customer",
  "payments",
  "region",
]

export const defaultFields = [
  "id",
  "display_id",
  "cart_id",
  "customer_id",
  "email",
  "region_id",
  "currency_code",
  "tax_rate",
  "created_at",
  "shipping_total",
  "discount_total",
  "tax_total",
  "refunded_total",
  "gift_card_total",
  "subtotal",
  "total",
]

export const allowedRelations = [
  "shipping_address",
  "fulfillments",
  "billing_address",
  "items",
  "items.variant",
  "items.variant.product",
  "shipping_methods",
  "discounts",
  "customer",
  "payments",
  "region",
]

export const allowedFields = [
  "id",
  "display_id",
  "cart_id",
  "customer_id",
  "email",
  "region_id",
  "currency_code",
  "tax_rate",
  "created_at",
  "shipping_total",
  "discount_total",
  "tax_total",
  "refunded_total",
  "gift_card_total",
  "subtotal",
  "total",
]
