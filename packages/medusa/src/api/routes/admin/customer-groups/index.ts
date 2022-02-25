import { Router } from "express"
import { CustomerGroup } from "../../../.."
import { DeleteResponse, PaginatedResponse } from "../../../../types/common"
import middlewares from "../../../middlewares"

const route = Router()

export default (app) => {
  app.use("/customer-groups", route)

  route.get("/:id", middlewares.wrap(require("./get-customer-group").default))
  route.post("/", middlewares.wrap(require("./create-customer-group").default))
  route.delete(
    "/:id/customers/batch",
    middlewares.wrap(require("./delete-customers-batch").default)
  )

  route.delete(
    "/:id",
    middlewares.wrap(require("./delete-customer-group").default)
  )
  route.post(
    "/:id",
    middlewares.wrap(require("./update-customer-group").default)
  )

  return app
}

export type AdminCustomerGroupsRes = {
  customer_group: CustomerGroup
}

export type AdminCustomerGroupsDeleteRes = DeleteResponse

export type AdminCustomerGroupsListRes = PaginatedResponse & {
  customer_groups: CustomerGroup[]
}

export const defaultAdminCustomerGroupsRelations = []

export * from "./create-customer-group"
