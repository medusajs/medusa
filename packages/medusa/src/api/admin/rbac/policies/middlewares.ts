import * as QueryConfig from "./query-config"

import {
  validateAndTransformBody,
  validateAndTransformQuery,
} from "@medusajs/framework"
import { MiddlewareRoute } from "@medusajs/framework/http"

import {
  AdminCreateRbacPolicy,
  AdminGetRbacPoliciesParams,
  AdminGetRbacPolicyParams,
  AdminUpdateRbacPolicy,
} from "./validators"

export const adminRbacPolicyRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: ["GET"],
    matcher: "/admin/rbac/policies",
    middlewares: [
      validateAndTransformQuery(
        AdminGetRbacPoliciesParams,
        QueryConfig.listTransformQueryConfig
      ),
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/rbac/policies/:id",
    middlewares: [
      validateAndTransformQuery(
        AdminGetRbacPolicyParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/rbac/policies",
    middlewares: [
      validateAndTransformBody(AdminCreateRbacPolicy),
      validateAndTransformQuery(
        AdminGetRbacPolicyParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/rbac/policies/:id",
    middlewares: [
      validateAndTransformBody(AdminUpdateRbacPolicy),
      validateAndTransformQuery(
        AdminGetRbacPolicyParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/rbac/policies/:id",
    middlewares: [],
  },
]
