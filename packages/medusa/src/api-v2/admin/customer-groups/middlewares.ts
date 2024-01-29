import { MedusaV2Flag } from "@medusajs/utils"

import {
  isFeatureFlagEnabled,
  transformBody,
  transformQuery,
} from "../../../api/middlewares"
import { MiddlewareRoute } from "../../../loaders/helpers/routing/types"
import * as QueryConfig from "./query-config"
import {
  AdminGetCustomerGroupsParams,
  AdminGetCustomerGroupsGroupParams,
  AdminPostCustomerGroupsReq,
  AdminPostCustomerGroupsGroupReq,
} from "./validators"

export const adminCustomerGroupRoutesMiddlewares: MiddlewareRoute[] = [
  {
    matcher: "/admin/customer-groups*",
    middlewares: [isFeatureFlagEnabled(MedusaV2Flag.key)],
  },
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
]
