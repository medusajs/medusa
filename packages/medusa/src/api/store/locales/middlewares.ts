import { MiddlewareRoute } from "@medusajs/framework/http"

export const storeLocalesRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: ["GET"],
    matcher: "/store/locales",
    middlewares: [],
  },
]
