import { Router } from "express"
import middlewares from "../../../middlewares"

const route = Router()

export default app => {
  app.use("/orders", route)

  /**
   * Lookup
   */
  route.get("/", middlewares.wrap(require("./lookup-order").default))

  /**
   * Retrieve Order
   */
  route.get("/:id", middlewares.wrap(require("./get-order").default))

  /**
   * Retrieve by Cart Id
   */
  route.get(
    "/cart/:cart_id",
    middlewares.wrap(require("./get-order-by-cart").default)
  )

  return app
}

export const defaultRelations = [
  "shipping_address",
  "fulfillments",
  "fulfillments.tracking_links",
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
  "status",
  "fulfillment_status",
  "payment_status",
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
  "items.refundable",
  "refunded_total",
  "gift_card_total",
  "subtotal",
  "total",
]

export const allowedRelations = [
  "shipping_address",
  "fulfillments",
  "fulfillments.tracking_links",
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
  "status",
  "fulfillment_status",
  "payment_status",
  "display_id",
  "cart_id",
  "customer_id",
  "email",
  "region_id",
  "currency_code",
  "items.refundable",
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
