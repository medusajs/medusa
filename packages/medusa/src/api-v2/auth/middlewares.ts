import {
  authenticate,
  validateInviteToken,
} from "../../utils/authenticate-middleware"

import { MiddlewareRoute } from "../../types/middlewares"

export const authRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: ["POST"],
    matcher: "/auth/session",
    middlewares: [authenticate(/.*/, "bearer")],
  },
  {
    method: ["POST", "GET"],
    matcher: "/auth/:scope/:authProvider",
    middlewares: [validateInviteToken],
  },
]
