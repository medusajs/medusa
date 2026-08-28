import {
  MiddlewareRoute,
  validateAndTransformQuery,
} from "@medusajs/framework/http"
import { RbacScopeParamsFields } from "../../roles/validators"

export const rbacMePermissionsMiddlewares: MiddlewareRoute[] = [
  {
    method: ["GET"],
    matcher: "/rbac/me/permissions",
    middlewares: [validateAndTransformQuery(RbacScopeParamsFields, {})],
  },
]
