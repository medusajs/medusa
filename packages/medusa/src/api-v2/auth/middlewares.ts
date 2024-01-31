import { MiddlewareRoute } from "../../loaders/helpers/routing/types"
import authenticate from "../../utils/authenticate-middleware"

export const authRoutesMiddlewares: MiddlewareRoute[] = [
  {
    matcher: "/auth/:scope/:authProvider",
    method: ["GET", "POST"],
    middlewares: [],
  },
  {
    matcher: "/auth/:scope/:authProvider/callback",
    method: ["GET", "POST"],
    middlewares: [],
  },
  {
    matcher: "/auth/:scope",
    method: ["GET"],
    middlewares: [authenticate("store", "session")],
  },
]
