import * as QueryConfig from "./query-config"

import {
  AdminCreateCustomer,
  AdminCreateCustomerAddress,
  AdminCustomerAdressesParams,
  AdminCustomerParams,
  AdminCustomersParams,
  AdminUpdateCustomer,
  AdminUpdateCustomerAddress,
} from "./validators"

import { MiddlewareRoute } from "../../../loaders/helpers/routing/types"
import { authenticate } from "../../../utils/authenticate-middleware"
import { validateAndTransformBody } from "../../utils/validate-body"
import { validateAndTransformQuery } from "../../utils/validate-query"

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
      validateAndTransformQuery(
        AdminCustomersParams,
        QueryConfig.listTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/customers",
    middlewares: [
      validateAndTransformBody(AdminCreateCustomer),
      validateAndTransformQuery(
        AdminCustomerParams,
        QueryConfig.listTransformQueryConfig
      ),
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/customers/:id",
    middlewares: [
      validateAndTransformQuery(
        AdminCustomerParams,
        QueryConfig.listTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/customers/:id",
    middlewares: [
      validateAndTransformBody(AdminUpdateCustomer),
      validateAndTransformQuery(
        AdminCustomerParams,
        QueryConfig.listTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/customers/:id/addresses",
    middlewares: [validateAndTransformBody(AdminCreateCustomerAddress)],
  },
  {
    method: ["POST"],
    matcher: "/admin/customers/:id/addresses/:address_id",
    middlewares: [validateAndTransformBody(AdminUpdateCustomerAddress)],
  },
  {
    method: ["GET"],
    matcher: "/admin/customers/:id/addresses",
    middlewares: [
      validateAndTransformQuery(
        AdminCustomerAdressesParams,
        QueryConfig.listAddressesTransformQueryConfig
      ),
    ],
  },
]
