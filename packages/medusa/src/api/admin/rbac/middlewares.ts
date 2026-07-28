import { MiddlewareRoute } from "@medusajs/framework/http"

import { adminRbacPolicyRoutesMiddlewares } from "./policies/middlewares"
import { adminRbacRoleRoutesMiddlewares } from "./roles/middlewares"
import { adminRbacMePermissionsMiddlewares } from "./me/permissions/middlewares"

export const adminRbacRoutesMiddlewares: MiddlewareRoute[] = [
  ...adminRbacRoleRoutesMiddlewares,
  ...adminRbacPolicyRoutesMiddlewares,
  ...adminRbacMePermissionsMiddlewares,
]
