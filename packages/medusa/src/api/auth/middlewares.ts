import { MiddlewareRoute } from "@medusajs/framework"
import { authenticate } from "../../utils/middlewares/authenticate-middleware"

export const authRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: ["POST"],
    matcher: "/auth/session",
    middlewares: [authenticate("*", "bearer")],
  },
  {
    method: ["DELETE"],
    matcher: "/auth/session",
    middlewares: [authenticate("*", ["session"])],
  },
  {
    method: ["POST"],
    matcher: "/auth/:actor_type/:auth_provider/callback",
    middlewares: [],
  },
  {
    method: ["POST"],
    matcher: "/auth/:actor_type/:auth_provider",
    middlewares: [],
  },
]
