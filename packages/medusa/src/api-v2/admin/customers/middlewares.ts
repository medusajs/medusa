import * as QueryConfig from "./query-config"

import {
  AdminGetCustomersCustomerAddressesParams,
  AdminGetCustomersCustomerParams,
  AdminGetCustomersParams,
  AdminPostCustomersCustomerAddressesAddressReq,
  AdminPostCustomersCustomerAddressesReq,
  AdminPostCustomersCustomerReq,
  AdminPostCustomersReq,
} from "./validators"
import { transformBody, transformQuery } from "../../../api/middlewares"

import { MiddlewareRoute } from "../../../loaders/helpers/routing/types"
import { authenticate } from "../../../utils/authenticate-middleware"

export const adminCustomerRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: ["ALL"],
    matcher: "/admin/customers*",
    middlewares: [authenticate("admin", ["bearer", "session"])],
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
  {
    method: ["POST"],
    matcher: "/admin/customers/:id/addresses",
    middlewares: [transformBody(AdminPostCustomersCustomerAddressesReq)],
  },
  {
    method: ["POST"],
    matcher: "/admin/customers/:id/addresses/:address_id",
    middlewares: [transformBody(AdminPostCustomersCustomerAddressesAddressReq)],
  },
  {
    method: ["GET"],
    matcher: "/admin/customers/:id/addresses",
    middlewares: [
      transformQuery(
        AdminGetCustomersCustomerAddressesParams,
        QueryConfig.listAddressesTransformQueryConfig
      ),
    ],
  },
]
