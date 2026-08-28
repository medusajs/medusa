import { MiddlewareRoute, validateAndTransformQuery } from "@medusajs/framework"
import {
  AdminGetRbacScopeOptionsParams,
  AdminGetRbacScopesParams,
} from "./validators"

export const rbacScopesMiddlewares: MiddlewareRoute[] = [
  {
    method: ["GET"],
    matcher: "/rbac/roles/scopes",
    middlewares: [validateAndTransformQuery(AdminGetRbacScopesParams, {})],
  },
  {
    method: ["GET"],
    matcher: "/rbac/roles/scopes/:type/options",
    middlewares: [
      validateAndTransformQuery(AdminGetRbacScopeOptionsParams, {}),
    ],
  },
]
