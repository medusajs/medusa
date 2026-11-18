import {
  validateAndTransformBody,
  validateAndTransformQuery,
} from "@medusajs/framework"
import { authorizeIfNecessary, MiddlewareRoute } from "@medusajs/framework/http"
import { PolicyOperation } from "@medusajs/framework/utils"
import * as QueryConfig from "./query-config"
import {
  AdminCreateViewConfiguration,
  AdminCreateViewConfigurationType,
  AdminUpdateViewConfiguration,
  AdminUpdateViewConfigurationType,
  AdminSetActiveViewConfiguration,
  AdminGetViewConfigurationParams,
  AdminGetActiveViewConfigurationParams,
  AdminGetViewConfigurationsParams,
} from "./validators"
import {
  ensureViewConfigurationsEnabled,
  ensureViewEntityReadable,
  isSystemDefaultViewConfiguration,
} from "./middleware"

export const viewConfigurationRoutesMiddlewares: MiddlewareRoute[] = [
  // Apply feature flag check to all view configuration routes
  {
    method: ["GET", "POST", "DELETE"],
    matcher: "/admin/views/{*splat}/configurations{*splat}",
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
      authorizeIfNecessary<AdminCreateViewConfigurationType>(
        (req) => !!req.validatedBody.is_system_default,
        {
          resource: "view_configuration",
          operation: PolicyOperation.create,
        }
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
      authorizeIfNecessary<AdminUpdateViewConfigurationType>(
        async (req) =>
          !!req.validatedBody.is_system_default ||
          (await isSystemDefaultViewConfiguration(req)),
        { resource: "view_configuration", operation: PolicyOperation.update }
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
      authorizeIfNecessary(isSystemDefaultViewConfiguration, {
        resource: "view_configuration",
        operation: PolicyOperation.delete,
      }),
    ],
  },
]
