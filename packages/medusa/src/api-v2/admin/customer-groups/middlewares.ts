import * as QueryConfig from "./query-config"

import { transformBody, transformQuery } from "../../../api/middlewares"
import {
  AdminDeleteCustomerGroupsGroupCustomersBatchReq,
  AdminGetCustomerGroupsGroupCustomersParams,
  AdminGetCustomerGroupsGroupParams,
  AdminGetCustomerGroupsParams,
  AdminPostCustomerGroupsGroupCustomersBatchReq,
  AdminPostCustomerGroupsGroupReq,
  AdminPostCustomerGroupsReq,
} from "./validators"

import { MiddlewareRoute } from "../../../loaders/helpers/routing/types"
import { authenticate } from "../../../utils/authenticate-middleware"
import { listTransformQueryConfig as customersListTransformQueryConfig } from "../customers/query-config"

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
    method: ["ALL"],
    matcher: "/admin/customer-groups*",
    middlewares: [authenticate("admin", ["bearer", "session"])],
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
    matcher: "/admin/customer-groups/:id/customers/batch/add",
    middlewares: [
      transformBody(AdminPostCustomerGroupsGroupCustomersBatchReq),
      transformQuery(
        AdminGetCustomerGroupsGroupParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/customer-groups/:id/customers/batch/remove",
    middlewares: [
      transformBody(AdminDeleteCustomerGroupsGroupCustomersBatchReq),
      transformQuery(
        AdminGetCustomerGroupsGroupParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
]
