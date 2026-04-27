import {
  validateAndTransformBody,
  validateAndTransformQuery,
} from "@medusajs/framework"
import { MiddlewareRoute } from "@medusajs/framework/http"
import * as QueryConfig from "./query-config"
import {
  AdminCreateViewConfiguration,
  AdminUpdateViewConfiguration,
  AdminSetActiveViewConfiguration,
  AdminGetViewConfigurationParams,
  AdminGetActiveViewConfigurationParams,
  AdminGetViewConfigurationsParams,
} from "./validators"
import { ensureViewConfigurationsEnabled } from "./middleware"

export const viewConfigurationRoutesMiddlewares: MiddlewareRoute[] = [
  // Apply feature flag check to all view configuration routes
  {
    method: ["GET", "POST", "DELETE"],
    matcher: "/admin/views/*/configurations*",
    middlewares: [ensureViewConfigurationsEnabled],
  },
  {
    method: ["GET"],
    matcher: "/admin/views/:entity/configurations",
    middlewares: [
      validateAndTransformQuery(
        AdminGetViewConfigurationsParams,
        QueryConfig.retrieveViewConfigurationList
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/views/:entity/configurations",
    middlewares: [
      validateAndTransformQuery(
        AdminGetViewConfigurationParams,
        QueryConfig.retrieveViewConfiguration
      ),
      validateAndTransformBody(AdminCreateViewConfiguration),
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/views/:entity/configurations/:id",
    middlewares: [
      validateAndTransformQuery(
        AdminGetViewConfigurationParams,
        QueryConfig.retrieveViewConfiguration
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/views/:entity/configurations/:id",
    middlewares: [
      validateAndTransformQuery(
        AdminGetViewConfigurationParams,
        QueryConfig.retrieveViewConfiguration
      ),
      validateAndTransformBody(AdminUpdateViewConfiguration),
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/views/:entity/configurations/active",
    middlewares: [
      validateAndTransformQuery(
        AdminGetActiveViewConfigurationParams,
        QueryConfig.retrieveViewConfiguration
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/views/:entity/configurations/active",
    middlewares: [validateAndTransformBody(AdminSetActiveViewConfiguration)],
  },
]
