import { Router } from "express"
import middlewares from "../../../middlewares"

const route = Router()

export default (app, container) => {
  const middlewareService = container.resolve("middlewareService")

  app.use("/customers", route)

  // Inject plugin routes
  const routers = middlewareService.getRouters("store/customers")
  for (const router of routers) {
    route.use("/", router)
  }

  route.post("/", middlewares.wrap(require("./create-customer").default))

  route.post(
    "/password-reset",
    middlewares.wrap(require("./reset-password").default)
  )

  route.post(
    "/password-token",
    middlewares.wrap(require("./reset-password-token").default)
  )

  // Authenticated endpoints
  route.use(middlewares.authenticate())

  route.get("/me", middlewares.wrap(require("./get-customer").default))
  route.post("/me", middlewares.wrap(require("./update-customer").default))

  route.get("/me/orders", middlewares.wrap(require("./list-orders").default))

  route.post(
    "/me/addresses",
    middlewares.wrap(require("./create-address").default)
  )

  route.post(
    "/me/addresses/:address_id",
    middlewares.wrap(require("./update-address").default)
  )

  route.delete(
    "/me/addresses/:address_id",
    middlewares.wrap(require("./delete-address").default)
  )

  route.get(
    "/me/payment-methods",
    middlewares.wrap(require("./get-payment-methods").default)
  )

  return app
}

export const defaultRelations = ["shipping_addresses", "billing_address"]

export const defaultFields = [
  "id",
  "email",
  "first_name",
  "last_name",
  "billing_address_id",
  "phone",
  "has_account",
  "created_at",
  "updated_at",
  "deleted_at",
  "metadata",
]

export const allowedRelations = [
  "shipping_addresses",
  "billing_address",
  "orders",
]

export const allowedFields = [
  "id",
  "email",
  "first_name",
  "last_name",
  "billing_address_id",
  "phone",
  "has_account",
  "created_at",
  "updated_at",
  "deleted_at",
  "metadata",
]
