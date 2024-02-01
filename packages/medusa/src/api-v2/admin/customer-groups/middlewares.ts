import { transformBody, transformQuery } from "../../../api/middlewares"
import { MiddlewareRoute } from "../../../loaders/helpers/routing/types"
import * as QueryConfig from "./query-config"
import { listTransformQueryConfig as customersListTransformQueryConfig } from "../customers/query-config"
import {
  AdminGetCustomerGroupsParams,
  AdminGetCustomerGroupsGroupParams,
  AdminPostCustomerGroupsReq,
  AdminPostCustomerGroupsGroupReq,
  AdminGetCustomerGroupsGroupCustomersParams,
  AdminPostCustomerGroupsGroupCustomersBatchReq,
  AdminDeleteCustomerGroupsGroupCustomersBatchReq,
} from "./validators"

export const adminCustomerGroupRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: ["GET"],
    matcher: "/admin/customer-groups",
    middlewares: [
      transformQuery(
        AdminGetCustomerGroupsParams,
        QueryConfig.listTransformQueryConfig
      ),
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/customer-groups/:id",
    middlewares: [
      transformQuery(
        AdminGetCustomerGroupsGroupParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/customer-groups",
    middlewares: [transformBody(AdminPostCustomerGroupsReq)],
  },
  {
    method: ["POST"],
    matcher: "/admin/customer-groups/:id",
    middlewares: [transformBody(AdminPostCustomerGroupsGroupReq)],
  },
  {
    method: ["GET"],
    matcher: "/admin/customer-groups/:id/customers",
    middlewares: [
      transformQuery(
        AdminGetCustomerGroupsGroupCustomersParams,
        customersListTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/customer-groups/:id/customers/batch",
    middlewares: [transformBody(AdminPostCustomerGroupsGroupCustomersBatchReq)],
  },
  {
    method: ["POST"],
    matcher: "/admin/customer-groups/:id/customers/remove",
    middlewares: [
      transformBody(AdminDeleteCustomerGroupsGroupCustomersBatchReq),
    ],
  },
]
