import {
  validateAndTransformBody,
  validateAndTransformQuery,
} from "@medusajs/framework"
import { MiddlewareRoute } from "@medusajs/framework/http"
import { PolicyOperation } from "@medusajs/framework/utils"
import { createLinkBody } from "../../utils/validators"
import * as QueryConfig from "./query-config"
import { Entities } from "./query-config"
import {
  AdminCreateCustomerGroup,
  AdminGetCustomerGroupParams,
  AdminGetCustomerGroupsParams,
  AdminUpdateCustomerGroup,
} from "./validators"

export const adminCustomerGroupRoutesMiddlewares: MiddlewareRoute[] = [
  {
    matcher: "/admin/customer-groups/*",
    policies: [
      {
        resource: Entities.customer_group,
        operation: PolicyOperation.read,
      },
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/customer-groups",
    middlewares: [
      validateAndTransformQuery(
        AdminGetCustomerGroupsParams,
        QueryConfig.listTransformQueryConfig
      ),
    ],
    policies: [
      {
        resource: Entities.customer_group,
        operation: PolicyOperation.read,
      },
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/customer-groups/:id",
    middlewares: [
      validateAndTransformQuery(
        AdminGetCustomerGroupParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/customer-groups",
    middlewares: [
      validateAndTransformBody(AdminCreateCustomerGroup),
      validateAndTransformQuery(
        AdminGetCustomerGroupParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
    policies: [
      {
        resource: Entities.customer_group,
        operation: PolicyOperation.create,
      },
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/customer-groups/:id",
    middlewares: [
      validateAndTransformBody(AdminUpdateCustomerGroup),
      validateAndTransformQuery(
        AdminGetCustomerGroupParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
    policies: [
      {
        resource: Entities.customer_group,
        operation: PolicyOperation.update,
      },
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/customer-groups/:id/customers",
    middlewares: [
      validateAndTransformBody(createLinkBody()),
      validateAndTransformQuery(
        AdminGetCustomerGroupParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
    policies: [
      {
        resource: Entities.customer_group,
        operation: PolicyOperation.update,
      },
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/customer-groups/:id",
    policies: [
      {
        resource: Entities.customer_group,
        operation: PolicyOperation.delete,
      },
    ],
  },
]
