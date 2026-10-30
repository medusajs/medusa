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
import { requireSuperAdmin } from "../../../utils/require-super-admin"
import {
  SYSTEM_DEFAULT_VIEW_CONFIGURATION_MESSAGE,
  ensureViewConfigurationsEnabled,
  ensureViewEntityReadable,
  isSystemDefaultViewConfiguration,
} from "./middleware"

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
      ensureViewEntityReadable,
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
      ensureViewEntityReadable,
      validateAndTransformQuery(
        AdminGetViewConfigurationParams,
        QueryConfig.retrieveViewConfiguration
      ),
      validateAndTransformBody(AdminCreateViewConfiguration),
      // A system default applies to every user.
      requireSuperAdmin(
        (req) => !!req.validatedBody.is_system_default,
        SYSTEM_DEFAULT_VIEW_CONFIGURATION_MESSAGE
      ),
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/views/:entity/configurations/:id",
    middlewares: [
      ensureViewEntityReadable,
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
      ensureViewEntityReadable,
      validateAndTransformQuery(
        AdminGetViewConfigurationParams,
        QueryConfig.retrieveViewConfiguration
      ),
      validateAndTransformBody(AdminUpdateViewConfiguration),
      // Changing a system default, or promoting a view to one, affects every user.
      requireSuperAdmin(
        async (req) =>
          !!req.validatedBody.is_system_default ||
          (await isSystemDefaultViewConfiguration(req)),
        SYSTEM_DEFAULT_VIEW_CONFIGURATION_MESSAGE
      ),
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/views/:entity/configurations/active",
    middlewares: [
      ensureViewEntityReadable,
      validateAndTransformQuery(
        AdminGetActiveViewConfigurationParams,
        QueryConfig.retrieveViewConfiguration
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/views/:entity/configurations/active",
    middlewares: [
      ensureViewEntityReadable,
      validateAndTransformBody(AdminSetActiveViewConfiguration),
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/views/:entity/configurations/:id",
    middlewares: [
      ensureViewEntityReadable,
      requireSuperAdmin(
        isSystemDefaultViewConfiguration,
        SYSTEM_DEFAULT_VIEW_CONFIGURATION_MESSAGE
      ),
    ],
  },
]
