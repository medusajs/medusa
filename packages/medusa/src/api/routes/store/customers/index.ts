import { Router } from "express"
import { Customer, Order } from "../../../.."
import { PaginatedResponse } from "../../../../types/common"
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

  route.post("/", require("./create-customer").default)

  route.post("/password-reset", require("./reset-password").default)

  route.post("/password-token", require("./reset-password-token").default)

  // Authenticated endpoints
  route.use(middlewares.authenticate())

  route.get("/me", require("./get-customer").default)
  route.post("/me", require("./update-customer").default)

  route.get("/me/orders", require("./list-orders").default)

  route.post("/me/addresses", require("./create-address").default)

  route.post("/me/addresses/:address_id", require("./update-address").default)

  route.delete("/me/addresses/:address_id", require("./delete-address").default)

  route.get("/me/payment-methods", require("./get-payment-methods").default)

  return app
}

export const defaultStoreCustomersRelations = [
  "shipping_addresses",
  "billing_address",
]

export const defaultStoreCustomersFields: (keyof Customer)[] = [
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

export const allowedStoreCustomersRelations = [
  "shipping_addresses",
  "billing_address",
  "orders",
]

export const allowedStoreCustomersFields = [
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

export type StoreCustomersRes = {
  customer: Omit<Customer, "password_hash">
}

export type StoreCustomersListOrdersRes = PaginatedResponse & {
  orders: Order[]
}

export type StoreCustomersListPaymentMethodsRes = {
  payment_methods: {
    provider_id: string
    data: object
  }[]
}

export * from "./create-address"
export * from "./create-customer"
export * from "./list-orders"
export * from "./reset-password"
export * from "./reset-password-token"
export * from "./update-address"
export * from "./update-customer"
