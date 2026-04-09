import { MiddlewareRoute } from "@medusajs/framework/http"
import { ensureViewConfigurationsEnabled } from "../[entity]/configurations/middleware"

export const entitiesRoutesMiddlewares: MiddlewareRoute[] = [
  // Apply feature flag check
  {
    method: ["GET"],
    matcher: "/admin/views/entities",
    middlewares: [ensureViewConfigurationsEnabled],
  },
]
