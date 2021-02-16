import { Router } from "express"
import middlewares from "../../../middlewares"

const route = Router()

export default app => {
  app.use("/draft-orders", route)

  route.get("/", middlewares.wrap(require("./list-draft-orders").default))

  route.get("/:id", middlewares.wrap(require("./get-draft-order").default))

  route.post("/", middlewares.wrap(require("./create-draft-order").default))

  route.delete(
    "/:id/line-items/:line_id",
    middlewares.wrap(require("./delete-line-item").default)
  )

  route.post(
    "/:id/line-items",
    middlewares.wrap(require("./create-line-item").default)
  )

  route.post("/", middlewares.wrap(require("./create-draft-order").default))

  route.post(
    "/:id/register-payment",
    middlewares.wrap(require("./register-payment").default)
  )

  return app
}

export const defaultRelations = []

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
]

export const defaultCartFields = [
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
]

export const defaultFields = [
  "id",
  "status",
  "display_id",
  "cart_id",
  "canceled_at",
  "created_at",
  "updated_at",
  "metadata",
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
]

export const allowedRelations = ["cart"]
