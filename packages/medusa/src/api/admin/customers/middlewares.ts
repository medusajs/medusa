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

import { MiddlewareRoute } from "@medusajs/framework/http"
import {
  validateAndTransformBody,
  validateAndTransformQuery,
} from "@medusajs/framework"
import { createLinkBody } from "../../utils/validators"

export const adminCustomerRoutesMiddlewares: MiddlewareRoute[] = [
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
  {
    method: ["POST"],
    matcher: "/admin/customers/:id/customer-groups",
    middlewares: [
      validateAndTransformBody(createLinkBody()),
      validateAndTransformQuery(
        AdminCustomerParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
]
