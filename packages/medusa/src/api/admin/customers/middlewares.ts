import * as QueryConfig from "./query-config"

import {
  AdminCreateCustomer,
  AdminCreateCustomerAddress,
  AdminCustomerAddressesParams,
  AdminCustomerParams,
  AdminCustomersParams,
  AdminUpdateCustomer,
  AdminUpdateCustomerAddress,
} from "./validators"

import { MiddlewareRoute } from "../../../loaders/helpers/routing/types"
import { authenticate } from "../../../utils/middlewares/authenticate-middleware"
import { validateAndTransformBody } from "../../utils/validate-body"
import { validateAndTransformQuery } from "../../utils/validate-query"

export const adminCustomerRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: ["ALL"],
    matcher: "/admin/customers*",
    middlewares: [authenticate("user", ["bearer", "session", "api-key"])],
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
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/customers/:id",
    middlewares: [
      validateAndTransformQuery(
        AdminCustomerParams,
        QueryConfig.retrieveTransformQueryConfig
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
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/customers/:id/addresses",
    middlewares: [
      validateAndTransformBody(AdminCreateCustomerAddress),
      validateAndTransformQuery(
        AdminCustomerParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/customers/:id/addresses/:address_id",
    middlewares: [
      validateAndTransformBody(AdminUpdateCustomerAddress),
      validateAndTransformQuery(
        AdminCustomerParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/customers/:id/addresses/:address_id",
    middlewares: [
      validateAndTransformQuery(
        AdminCustomerParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/customers/:id/addresses",
    middlewares: [
      validateAndTransformQuery(
        AdminCustomerAddressesParams,
        QueryConfig.listAddressesTransformQueryConfig
      ),
    ],
  },
]
