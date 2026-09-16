import { validateAndTransformBody } from "@medusajs/framework"
import { MiddlewareRoute } from "@medusajs/framework/http"
import { authenticate } from "../../../utils/middlewares/authenticate-middleware"
import { AdminReindexSearchIndex } from "./validators"

export const adminSearchIndexRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: ["GET"],
    matcher: "/admin/search-indexes",
    middlewares: [authenticate("user", ["session", "bearer", "api-key"])],
  },
  {
    method: ["POST"],
    matcher: "/admin/search-indexes/:id/reindex",
    middlewares: [
      authenticate("user", ["session", "bearer", "api-key"]),
      validateAndTransformBody(AdminReindexSearchIndex),
    ],
  },
]
