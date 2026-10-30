import { validateAndTransformBody } from "@medusajs/framework"
import { authorize, MiddlewareRoute } from "@medusajs/framework/http"
import { authenticate } from "../../../utils/middlewares/authenticate-middleware"
import { AdminReindexSearchIndex } from "./validators"

export const adminSearchIndexRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: ["GET"],
    matcher: "/admin/search-indexes",
    middlewares: [authenticate("user", ["session", "bearer", "api-key"])],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/search-indexes/:id",
    middlewares: [
      authenticate("user", ["session", "bearer", "api-key"]),
      // Infrastructure operation, reserved to super admins.
      authorize({ resource: "*", operation: "*" }),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/search-indexes/:id/reindex",
    middlewares: [
      authenticate("user", ["session", "bearer", "api-key"]),
      // Infrastructure operation, reserved to super admins.
      authorize({ resource: "*", operation: "*" }),
      validateAndTransformBody(AdminReindexSearchIndex),
    ],
  },
]
