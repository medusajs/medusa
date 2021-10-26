import { Router } from "express"
import middlewares from "../../../middlewares"

const route = Router()

export default (app) => {
  app.use("/swaps", route)

  /**
   * List swaps
   */
  route.get("/", middlewares.wrap(require("./list-swaps").default))

  /**
   * Get a swap
   */
  route.get("/:id", middlewares.wrap(require("./get-swap").default))

  return app
}

export const defaultRelations = [
  "order",
  "additional_items",
  "return_order",
  "fulfillments",
  "payment",
  "shipping_address",
  "shipping_methods",
  "cart",
  "cart.items",
  "cart.region",
  "cart.shipping_methods",
  "cart.gift_cards",
  "cart.discounts",
  "cart.payment",
]

export const defaultFields = [
  "id",
  "fulfillment_status",
  "payment_status",
  "order_id",
  "difference_due",
  "cart_id",
  "created_at",
  "updated_at",
  "metadata",
  "cart.subtotal",
  "cart.tax_total",
  "cart.shipping_total",
  "cart.discount_total",
  "cart.gift_card_total",
  "cart.total",
]
