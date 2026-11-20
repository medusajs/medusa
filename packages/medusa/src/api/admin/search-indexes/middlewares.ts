import { validateAndTransformBody } from "@medusajs/framework"
import { authorize, MiddlewareRoute } from "@medusajs/framework/http"
import { PolicyOperation } from "@medusajs/framework/utils"
import { authenticate } from "../../../utils/middlewares/authenticate-middleware"
import { AdminReindexSearchIndex } from "./validators"

export const adminSearchIndexRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: ["GET"],
    matcher: "/admin/search-indexes",
    middlewares: [
      authenticate("user", ["session", "bearer", "api-key"]),
      authorize({ resource: "search_index", operation: PolicyOperation.read }),
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/search-indexes/:id",
    middlewares: [
      authenticate("user", ["session", "bearer", "api-key"]),
      authorize({
        resource: "search_index",
        operation: PolicyOperation.delete,
      }),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/search-indexes/:id/reindex",
    middlewares: [
      authenticate("user", ["session", "bearer", "api-key"]),
      authorize({
        resource: "search_index_sync",
        operation: PolicyOperation.create,
      }),
      validateAndTransformBody(AdminReindexSearchIndex),
    ],
  },
]
