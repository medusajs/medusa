import { MiddlewareRoute } from "@zjedene-medusa/framework/http"

export const storeLocalesRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: ["GET"],
    matcher: "/store/locales",
    middlewares: [],
  },
]
