import { validateAndTransformBody } from "@medusajs/framework"
import { authenticate, MiddlewareRoute } from "@medusajs/framework/http"
import { StoreSearch } from "./validators"

export const storeSearchRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: ["POST"],
    matcher: "/store/search",
    middlewares: [
      authenticate("customer", ["session", "bearer"], {
        allowUnauthenticated: true,
      }),
      validateAndTransformBody(StoreSearch),
    ],
  },
]
