import { MiddlewareRoute } from "@medusajs/framework/http"

import { rbacPolicyRoutesMiddlewares } from "./policies/middlewares"
import { rbacRoleRoutesMiddlewares } from "./roles/middlewares"
import { rbacMePermissionsMiddlewares } from "./me/permissions/middlewares"

export const rbacRoutesMiddlewares: MiddlewareRoute[] = [
  ...rbacRoleRoutesMiddlewares,
  ...rbacPolicyRoutesMiddlewares,
  ...rbacMePermissionsMiddlewares,
]
