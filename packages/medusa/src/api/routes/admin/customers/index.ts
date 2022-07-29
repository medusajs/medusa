import { Router } from "express"
import { Customer } from "../../../.."
import { DeleteResponse, PaginatedResponse } from "../../../../types/common"
import middlewares from "../../../middlewares"

const route = Router()

export default (app) => {
  app.use("/customers", route)

  route.get(
    "/",
    middlewares.normalizeQuery(),
    require("./list-customers").default
  )
  route.get("/:id", require("./get-customer").default)

  route.post("/", require("./create-customer").default)
  route.post("/:id", require("./update-customer").default)
  return app
}

export type AdminCustomersRes = {
  customer: Customer
}

export type AdminCustomersDeleteRes = DeleteResponse

export type AdminCustomersListRes = PaginatedResponse & {
  customers: Customer[]
}

export const defaultAdminCustomersRelations = ["orders", "shipping_addresses"]

export * from "./create-customer"
export * from "./get-customer"
export * from "./list-customers"
export * from "./update-customer"
