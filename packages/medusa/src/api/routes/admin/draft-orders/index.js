import { Router } from "express"
import middlewares from "../../../middlewares"

const route = Router()

export default (app) => {
  app.use("/draft-orders", route)

  route.get("/", middlewares.wrap(require("./list-draft-orders").default))

  route.get("/:id", middlewares.wrap(require("./get-draft-order").default))

  route.post("/", middlewares.wrap(require("./create-draft-order").default))

  route.post("/:id", middlewares.wrap(require("./update-draft-order").default))

  route.delete(
    "/:id",
    middlewares.wrap(require("./delete-draft-order").default)
  )

  route.delete(
    "/:id/line-items/:line_id",
    middlewares.wrap(require("./delete-line-item").default)
  )

  route.post(
    "/:id/line-items",
    middlewares.wrap(require("./create-line-item").default)
  )

  route.post(
    "/:id/line-items/:line_id",
    middlewares.wrap(require("./update-line-item").default)
  )

  route.post("/", middlewares.wrap(require("./create-draft-order").default))

  route.post(
    "/:id/pay",
    middlewares.wrap(require("./register-payment").default)
  )

  return app
}

export const defaultRelations = ["order", "cart"]

export const defaultCartRelations = [
  "region",
  "items",
  "payment",
  "shipping_address",
  "billing_address",
  "region.payment_providers",
  "shipping_methods",
  "payment_sessions",
  "shipping_methods.shipping_option",
  "discounts",
  "discounts.rule",
]

export const defaultCartFields = [
  "subtotal",
  "tax_total",
  "shipping_total",
  "discount_total",
  "gift_card_total",
  "total",
]

export const defaultFields = [
  "id",
  "status",
  "display_id",
  "cart_id",
  "order_id",
  "canceled_at",
  "created_at",
  "updated_at",
  "metadata",
  "no_notification_order",
]

export const allowedFields = [
  "id",
  "status",
  "display_id",
  "cart_id",
  "canceled_at",
  "created_at",
  "updated_at",
  "metadata",
  "no_notification_order",
]

export const allowedRelations = ["cart"]
