import { validateAndTransformQuery } from "@medusajs/framework"
import { MiddlewareRoute } from "@medusajs/framework/http"
import { ensureViewConfigurationsEnabled } from "../configurations/middleware"
import { AdminGetColumnsParams } from "./validators"

export const columnRoutesMiddlewares: MiddlewareRoute[] = [
  // Apply feature flag check to all column routes
  {
    method: ["GET", "POST"],
    matcher: "/admin/views/*/columns",
    middlewares: [ensureViewConfigurationsEnabled],
  },
  {
    method: ["GET"],
    matcher: "/admin/views/:entity/columns",
    middlewares: [
      ensureViewConfigurationsEnabled,
      validateAndTransformQuery(AdminGetColumnsParams, {}),
    ],
  },
]
