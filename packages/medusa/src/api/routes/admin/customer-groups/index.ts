import { Router } from "express"
import { CustomerGroup } from "../../../.."
import { DeleteResponse, PaginatedResponse } from "../../../../types/common"
import { transformQuery } from "../../../middlewares"
import { AdminGetCustomerGroupsGroupParams } from "./get-customer-group"
import { AdminGetCustomerGroupsParams } from "./list-customer-groups"

const route = Router()

export default (app) => {
  app.use("/customer-groups", route)

  route.post("/", require("./create-customer-group").default)
  route.get(
    "/",
    transformQuery(AdminGetCustomerGroupsParams, {
      defaultRelations: defaultAdminCustomerGroupsRelations,
      isList: true,
    }),
    require("./list-customer-groups").default
  )

  const customerGroupRouter = Router({ mergeParams: true })
  route.use("/:id", customerGroupRouter)
  customerGroupRouter.get(
    "/",
    transformQuery(AdminGetCustomerGroupsGroupParams, {
      defaultRelations: defaultAdminCustomerGroupsRelations,
    }),
    require("./get-customer-group").default
  )
  customerGroupRouter.delete("/", require("./delete-customer-group").default)
  customerGroupRouter.post("/", require("./update-customer-group").default)
  customerGroupRouter.get(
    "/customers",
    require("./get-customer-group-customers").default
  )
  customerGroupRouter.post(
    "/customers/batch",
    require("./add-customers-batch").default
  )
  customerGroupRouter.delete(
    "/customers/batch",
    require("./delete-customers-batch").default
  )

  return app
}

/* ************************************** */
/* ******** EXPORT API CLIENT TYPES ***** */
/* ************************************** */

export type AdminCustomerGroupsRes = {
  customer_group: CustomerGroup
}

export type AdminCustomerGroupsDeleteRes = DeleteResponse

export type AdminCustomerGroupsListRes = PaginatedResponse & {
  customer_groups: CustomerGroup[]
}

export const defaultAdminCustomerGroupsRelations = []

export * from "./add-customers-batch"
export * from "./create-customer-group"
export * from "./delete-customers-batch"
export * from "./get-customer-group"
export * from "./list-customer-groups"
export * from "./update-customer-group"
