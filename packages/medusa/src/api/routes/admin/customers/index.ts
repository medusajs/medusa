import { Router } from "express"
import { Customer } from "../../../.."
import { PaginatedResponse } from "../../../../types/common"
import middlewares from "../../../middlewares"

const route = Router()

export default (app) => {
  app.use("/customers", route)

  route.get(
    "/",
    middlewares.normalizeQuery(),
    middlewares.wrap(require("./list-customers").default)
  )
  route.get("/:id", middlewares.wrap(require("./get-customer").default))

  route.post("/", middlewares.wrap(require("./create-customer").default))
  route.post("/:id", middlewares.wrap(require("./update-customer").default))
  return app
}

/**
 * @schema AdminCustomersRes
 * type: object
 * x-expanded-relations:
 *   field: customer
 *   relations:
 *     - orders
 *     - shipping_addresses
 * required:
 *   - customer
 * properties:
 *   customer:
 *     $ref: "#/components/schemas/Customer"
 */
export type AdminCustomersRes = {
  customer: Customer
}

/**
 * @schema AdminCustomersListRes
 * type: object
 * required:
 *   - customers
 *   - count
 *   - offset
 *   - limit
 * properties:
 *   customers:
 *     type: array
 *     items:
 *       $ref: "#/components/schemas/Customer"
 *   count:
 *     type: integer
 *     description: The total number of items available
 *   offset:
 *     type: integer
 *     description: The number of items skipped before these items
 *   limit:
 *     type: integer
 *     description: The number of items per page
 */
export type AdminCustomersListRes = PaginatedResponse & {
  customers: Customer[]
}

export const defaultAdminCustomersRelations = ["orders", "shipping_addresses"]

export * from "./create-customer"
export * from "./get-customer"
export * from "./list-customers"
export * from "./update-customer"
