import { Router } from "express"
import { CustomerGroup } from "../../../.."
import { DeleteResponse, PaginatedResponse } from "../../../../types/common"
import middlewares, { transformQuery } from "../../../middlewares"
import { AdminGetCustomerGroupsGroupParams } from "./get-customer-group"
import { AdminGetCustomerGroupsParams } from "./list-customer-groups"

const route = Router()

export default (app) => {
  app.use("/customer-groups", route)

  route.post("/", middlewares.wrap(require("./create-customer-group").default))
  route.get(
    "/",
    transformQuery(AdminGetCustomerGroupsParams, {
      defaultRelations: defaultAdminCustomerGroupsRelations,
      isList: true,
    }),
    middlewares.wrap(require("./list-customer-groups").default)
  )

  const customerGroupRouter = Router({ mergeParams: true })
  route.use("/:id", customerGroupRouter)
  customerGroupRouter.get(
    "/",
    transformQuery(AdminGetCustomerGroupsGroupParams, {
      defaultRelations: defaultAdminCustomerGroupsRelations,
    }),
    middlewares.wrap(require("./get-customer-group").default)
  )
  customerGroupRouter.delete(
    "/",
    middlewares.wrap(require("./delete-customer-group").default)
  )
  customerGroupRouter.post(
    "/",
    middlewares.wrap(require("./update-customer-group").default)
  )
  customerGroupRouter.get(
    "/customers",
    middlewares.wrap(require("./get-customer-group-customers").default)
  )
  customerGroupRouter.post(
    "/customers/batch",
    middlewares.wrap(require("./add-customers-batch").default)
  )
  customerGroupRouter.delete(
    "/customers/batch",
    middlewares.wrap(require("./delete-customers-batch").default)
  )

  return app
}

/* ************************************** */
/* ******** EXPORT API CLIENT TYPES ***** */
/* ************************************** */
/**
 * @schema AdminCustomerGroupsRes
 * type: object
 * properties:
 *   customer_group:
 *     $ref: "#/components/schemas/CustomerGroup"
 */
export type AdminCustomerGroupsRes = {
  customer_group: CustomerGroup
}

/**
 * @schema AdminCustomerGroupsDeleteRes
 * type: object
 * properties:
 *   id:
 *     type: string
 *     description: The ID of the deleted customer group.
 *   object:
 *     type: string
 *     description: The type of the object that was deleted.
 *     default: customer_group
 *   deleted:
 *     type: boolean
 *     description: Whether the customer group was deleted successfully or not.
 *     default: true
 */
export type AdminCustomerGroupsDeleteRes = DeleteResponse

/**
 * @schema AdminCustomerGroupsListRes
 * type: object
 * properties:
 *   customer_groups:
 *     type: array
 *     items:
 *       $ref: "#/components/schemas/CustomerGroup"
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
