import {
  MiddlewareRoute,
  validateAndTransformQuery,
} from "@medusajs/framework/http"
import { RbacScopeParamsFields } from "../../roles/validators"

export const adminRbacMePermissionsMiddlewares: MiddlewareRoute[] = [
  {
    method: ["GET"],
    matcher: "/admin/rbac/me/permissions",
    middlewares: [validateAndTransformQuery(RbacScopeParamsFields, {})],
  },
]
