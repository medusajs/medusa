import { MiddlewareRoute } from "@medusajs/framework/http"

import { rbacPolicyRoutesMiddlewares } from "./policies/middlewares"
import { rbacRoleRoutesMiddlewares } from "./roles/middlewares"
import { rbacMePermissionsMiddlewares } from "./me/permissions/middlewares"
import { rbacScopesMiddlewares } from "./roles/scopes/middlewares"

export const rbacRoutesMiddlewares: MiddlewareRoute[] = [
  ...rbacRoleRoutesMiddlewares,
  ...rbacPolicyRoutesMiddlewares,
  ...rbacMePermissionsMiddlewares,
  ...rbacScopesMiddlewares,
]
