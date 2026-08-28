import * as QueryConfig from "./query-config"
import { Entities } from "./query-config"

import {
  AdminCreateCustomer,
  AdminCreateCustomerAddress,
  AdminCustomerAddressesParams,
  AdminCustomerAddressParams,
  AdminCustomerParams,
  AdminCustomersParams,
  AdminUpdateCustomer,
  AdminUpdateCustomerAddress,
} from "./validators"

import {
  validateAndTransformBody,
  validateAndTransformQuery,
} from "@medusajs/framework"
import { authorize, MiddlewareRoute } from "@medusajs/framework/http"
import { PolicyOperation } from "@medusajs/framework/utils"
import { createLinkBody } from "../../utils/validators"

export const adminCustomerRoutesMiddlewares: MiddlewareRoute[] = [
  {
    matcher: "/admin/customers/*",
    middlewares: [
      authorize([
        {
          resource: Entities.customer,
          operation: PolicyOperation.read,
        },
      ]),
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/customers",
    middlewares: [
      authorize([
        {
          resource: Entities.customer,
          operation: PolicyOperation.read,
        },
      ]),
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
      authorize([
        {
          resource: Entities.customer,
          operation: PolicyOperation.create,
        },
      ]),
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
      authorize([
        {
          resource: Entities.customer,
          operation: PolicyOperation.update,
        },
      ]),
      validateAndTransformBody(AdminUpdateCustomer),
      validateAndTransformQuery(
        AdminCustomerParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/customers/:id",
    middlewares: [
      authorize([
        {
          resource: Entities.customer,
          operation: PolicyOperation.delete,
        },
      ]),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/customers/:id/addresses",
    middlewares: [
      authorize([
        {
          resource: Entities.customer_address,
          operation: PolicyOperation.create,
        },
        {
          resource: Entities.customer,
          operation: PolicyOperation.update,
        },
      ]),
      validateAndTransformBody(AdminCreateCustomerAddress),
      validateAndTransformQuery(
        AdminCustomerParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/customers/:id/addresses/:address_id",
    middlewares: [
      authorize([
        {
          resource: Entities.customer_address,
          operation: PolicyOperation.read,
        },
      ]),
      validateAndTransformQuery(
        AdminCustomerAddressParams,
        QueryConfig.retrieveAddressTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/customers/:id/addresses/:address_id",
    middlewares: [
      authorize([
        {
          resource: Entities.customer_address,
          operation: PolicyOperation.update,
        },
        {
          resource: Entities.customer,
          operation: PolicyOperation.update,
        },
      ]),
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
      authorize([
        {
          resource: Entities.customer_address,
          operation: PolicyOperation.delete,
        },
        {
          resource: Entities.customer,
          operation: PolicyOperation.update,
        },
      ]),
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
      authorize([
        {
          resource: Entities.customer_address,
          operation: PolicyOperation.read,
        },
      ]),
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
      authorize([
        {
          resource: Entities.customer,
          operation: PolicyOperation.update,
        },
        {
          resource: Entities.customer_group,
          operation: PolicyOperation.update,
        },
      ]),
      validateAndTransformBody(createLinkBody()),
      validateAndTransformQuery(
        AdminCustomerParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
]
