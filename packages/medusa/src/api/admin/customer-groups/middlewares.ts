import {
  validateAndTransformBody,
  validateAndTransformQuery,
} from "@medusajs/framework"
import { authorize, MiddlewareRoute } from "@medusajs/framework/http"
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
    middlewares: [
      authorize([
        {
          resource: Entities.customer_group,
          operation: PolicyOperation.read,
        },
      ]),
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/customer-groups",
    middlewares: [
      authorize([
        {
          resource: Entities.customer_group,
          operation: PolicyOperation.read,
        },
      ]),
      validateAndTransformQuery(
        AdminGetCustomerGroupsParams,
        QueryConfig.listTransformQueryConfig
      ),
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
      authorize([
        {
          resource: Entities.customer_group,
          operation: PolicyOperation.create,
        },
      ]),
      validateAndTransformBody(AdminCreateCustomerGroup),
      validateAndTransformQuery(
        AdminGetCustomerGroupParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/customer-groups/:id",
    middlewares: [
      authorize([
        {
          resource: Entities.customer_group,
          operation: PolicyOperation.update,
        },
      ]),
      validateAndTransformBody(AdminUpdateCustomerGroup),
      validateAndTransformQuery(
        AdminGetCustomerGroupParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/customer-groups/:id/customers",
    middlewares: [
      authorize([
        {
          resource: Entities.customer_group,
          operation: PolicyOperation.update,
        },
        {
          resource: Entities.customer,
          operation: PolicyOperation.update,
        },
      ]),
      validateAndTransformBody(createLinkBody()),
      validateAndTransformQuery(
        AdminGetCustomerGroupParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/customer-groups/:id",
    middlewares: [
      authorize([
        {
          resource: Entities.customer_group,
          operation: PolicyOperation.delete,
        },
      ]),
    ],
  },
]
