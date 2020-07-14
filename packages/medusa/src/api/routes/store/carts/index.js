import { Router } from "express"
import middlewares from "../../../middlewares"

const route = Router()

export default app => {
  app.use("/carts", route)

  route.get("/:id", middlewares.wrap(require("./get-cart").default))

  route.post("/", middlewares.wrap(require("./create-cart").default))
  route.post("/:id", middlewares.wrap(require("./update-cart").default))

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

  route.delete(
    "/:id/payment-sessions/:provider_id",
    middlewares.wrap(require("./delete-payment-session").default)
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
