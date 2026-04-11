import { authenticate, MiddlewareRoute } from "@medusajs/framework/http"

export const cloudRoutesMiddlewares: MiddlewareRoute[] = [
  {
    matcher: "/cloud/auth",
    method: ["GET"],
    middlewares: [],
  },
  {
    matcher: "/cloud/auth/users",
    method: ["POST"],
    middlewares: [
      // Allow users who are authenticated but don't yet have an actor (user record)
      authenticate("user", ["session", "bearer"], {
        allowUnregistered: true,
      }),
    ],
  },
]
