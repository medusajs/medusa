import { transformBody, transformQuery } from "../../../api/middlewares"
import { MiddlewareRoute } from "../../../loaders/helpers/routing/types"
import * as QueryConfig from "./query-config"
import {
  AdminGetCustomersParams,
  AdminGetCustomersCustomerParams,
  AdminPostCustomersReq,
  AdminPostCustomersCustomerReq,
} from "./validators"

export const adminCustomerRoutesMiddlewares: MiddlewareRoute[] = [
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
    method: ["POST"],
    matcher: "/admin/customers",
    middlewares: [transformBody(AdminPostCustomersReq)],
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
