import { MiddlewareRoute, validateAndTransformQuery } from "@medusajs/framework"
import { AdminGetRbacScopesParams } from "./validators"

export const rbacScopesMiddlewares: MiddlewareRoute[] = [
  {
    method: ["GET"],
    matcher: "/rbac/roles/scopes",
    middlewares: [validateAndTransformQuery(AdminGetRbacScopesParams, {})],
  },
]
