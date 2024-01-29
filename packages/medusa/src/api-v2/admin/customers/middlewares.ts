import { MedusaV2Flag } from "@medusajs/utils"

import {
  isFeatureFlagEnabled,
  transformBody,
  transformQuery,
} from "../../../api/middlewares"
import { MiddlewareRoute } from "../../../loaders/helpers/routing/types"
import * as QueryConfig from "./query-config"
import {
  AdminGetCustomersParams,
  AdminGetCustomersCustomerParams,
  AdminPostCustomersCustomerReq,
} from "./validators"

export const adminCustomerRoutesMiddlewares: MiddlewareRoute[] = [
  {
    matcher: "/admin/customers*",
    middlewares: [isFeatureFlagEnabled(MedusaV2Flag.key)],
  },
  {
    method: ["GET"],
    matcher: "/admin/customers",
    middlewares: [
      transformQuery(
        AdminGetCustomersParams,
        QueryConfig.listTransformQueryConfig
      ),
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/customers/:id",
    middlewares: [
      transformQuery(
        AdminGetCustomersCustomerParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/customers/:id",
    middlewares: [transformBody(AdminPostCustomersCustomerReq)],
  },
]
