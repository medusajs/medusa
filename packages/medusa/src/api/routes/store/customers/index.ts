import { Router } from "express"
import { Customer, Order } from "../../../.."
import { PaginatedResponse } from "../../../../types/common"
import middlewares, { transformQuery } from "../../../middlewares"
import {
  defaultStoreOrdersFields,
  defaultStoreOrdersRelations,
} from "../orders"
import { StoreGetCustomersCustomerOrdersParams } from "./list-orders"

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
  route.use(middlewares.requireCustomerAuthentication())

  route.get("/me", middlewares.wrap(require("./get-customer").default))
  route.post("/me", middlewares.wrap(require("./update-customer").default))

  route.get(
    "/me/orders",
    transformQuery(StoreGetCustomersCustomerOrdersParams, {
      defaultFields: defaultStoreOrdersFields,
      defaultRelations: defaultStoreOrdersRelations,
      isList: true,
    }),
    middlewares.wrap(require("./list-orders").default)
  )

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

/**
 * @schema StoreCustomersRes
 * type: object
 * required:
 *   - customer
 * properties:
 *   customer:
 *     $ref: "#/components/schemas/Customer"
 */
export type StoreCustomersRes = {
  customer: Omit<Customer, "password_hash">
}

/**
 * @schema StoreCustomersListOrdersRes
 * type: object
 * required:
 *   - orders
 *   - count
 *   - offset
 *   - limit
 * properties:
 *   orders:
 *     type: array
 *     items:
 *       $ref: "#/components/schemas/Order"
 *   count:
 *     description: The total number of items available
 *     type: integer
 *   offset:
 *     description: The number of items skipped before these items
 *     type: integer
 *   limit:
 *     description: The number of items per page
 *     type: integer
 */
export type StoreCustomersListOrdersRes = PaginatedResponse & {
  orders: Order[]
}

/**
 * @schema StoreCustomersListPaymentMethodsRes
 * type: object
 * required:
 *   - payment_methods
 * properties:
 *   payment_methods:
 *     type: array
 *     items:
 *       type: object
 *       required:
 *         - provider_id
 *         - data
 *       properties:
 *         provider_id:
 *           description: The id of the Payment Provider where the payment method is saved.
 *           type: string
 *         data:
 *           description: The data needed for the Payment Provider to use the saved payment method.
 *           type: object
 */
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
