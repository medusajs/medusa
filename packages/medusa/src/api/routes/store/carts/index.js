import { Router } from "express"
import middlewares from "../../../middlewares"

const route = Router()

export default (app, container) => {
  const middlewareService = container.resolve("middlewareService")

  app.use("/carts", route)

  // Inject plugin routes
  const routers = middlewareService.getRouters("store/carts")
  for (const router of routers) {
    route.use("/", router)
  }

  route.get("/:id", middlewares.wrap(require("./get-cart").default))

  route.post(
    "/",
    middlewareService.usePreCartCreation(),
    middlewares.wrap(require("./create-cart").default)
  )

  route.post("/:id", middlewares.wrap(require("./update-cart").default))

  route.post(
    "/:id/complete-cart",
    middlewares.wrap(require("./complete-cart").default)
  )

  // Line items
  route.post(
    "/:id/line-items",
    middlewares.wrap(require("./create-line-item").default)
  )
  route.post(
    "/:id/line-items/:line_id",
    middlewares.wrap(require("./update-line-item").default)
  )
  route.delete(
    "/:id/line-items/:line_id",
    middlewares.wrap(require("./delete-line-item").default)
  )

  route.delete(
    "/:id/discounts/:code",
    middlewares.wrap(require("./delete-discount").default)
  )

  // Payment sessions
  route.post(
    "/:id/payment-sessions",
    middlewares.wrap(require("./create-payment-sessions").default)
  )

  route.post(
    "/:id/payment-session/update",
    middlewares.wrap(require("./update-payment-session").default)
  )

  route.delete(
    "/:id/payment-sessions/:provider_id",
    middlewares.wrap(require("./delete-payment-session").default)
  )

  route.post(
    "/:id/payment-sessions/:provider_id/refresh",
    middlewares.wrap(require("./refresh-payment-session").default)
  )

  route.post(
    "/:id/payment-session",
    middlewares.wrap(require("./set-payment-session").default)
  )

  route.post(
    "/:id/payment-method",
    middlewares.wrap(require("./update-payment-method").default)
  )

  // Shipping Options
  route.post(
    "/:id/shipping-methods",
    middlewares.wrap(require("./add-shipping-method").default)
  )

  return app
}

export const defaultFields = [
  "subtotal",
  "tax_total",
  "shipping_total",
  "discount_total",
  "gift_card_total",
  "total",
]

export const defaultRelations = [
  "gift_cards",
  "region",
  "items",
  "payment",
  "shipping_address",
  "billing_address",
  "region.countries",
  "region.payment_providers",
  "shipping_methods",
  "payment_sessions",
  "shipping_methods.shipping_option",
  "discounts",
]
