import {
  validateAndTransformBody,
  validateAndTransformQuery,
} from "@medusajs/framework"
import { MiddlewareRoute } from "@medusajs/framework/http"

import * as QueryConfig from "./query-config"
import {
  AdminCreateOrganization,
  AdminGetOrganizationParams,
  AdminGetOrganizationsParams,
  AdminUpdateOrganization,
} from "./validators"

export const adminOrganizationRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: ["GET"],
    matcher: "/admin/organizations",
    middlewares: [
      validateAndTransformQuery(
        AdminGetOrganizationsParams,
        QueryConfig.listTransformQueryConfig
      ),
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/organizations/:id",
    middlewares: [
      validateAndTransformQuery(
        AdminGetOrganizationParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/organizations",
    middlewares: [
      validateAndTransformBody(AdminCreateOrganization),
      validateAndTransformQuery(
        AdminGetOrganizationParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/organizations/:id",
    middlewares: [
      validateAndTransformBody(AdminUpdateOrganization),
      validateAndTransformQuery(
        AdminGetOrganizationParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/organizations/:id",
    middlewares: [],
  },
]
