import { Router } from "express"
import { Customer } from "../../../.."
import { DeleteResponse, PaginatedResponse } from "../../../../types/common"
import middlewares from "../../../middlewares"

const route = Router()

export default (app) => {
  app.use("/customers", route)

  route.get("/", middlewares.wrap(require("./list-customers").default))
  route.get("/:id", middlewares.wrap(require("./get-customer").default))

  route.post("/", middlewares.wrap(require("./create-customer").default))
  route.post("/:id", middlewares.wrap(require("./update-customer").default))
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
