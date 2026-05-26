import * as QueryConfig from "./query-config"

import {
  validateAndTransformBody,
  validateAndTransformQuery,
} from "@medusajs/framework"
import { MiddlewareRoute } from "@medusajs/framework/http"
import { PolicyOperation } from "@medusajs/framework/utils"

import {
  AdminCreateRbacPolicy,
  AdminGetRbacPoliciesParams,
  AdminGetRbacPolicyParams,
  AdminGetRbacPolicyRolesParams,
  AdminUpdateRbacPolicy,
} from "./validators"

const RBAC_POLICY_RESOURCE = "rbac_policy"
const RBAC_ROLE_RESOURCE = "rbac_role"

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
    policies: [
      { resource: RBAC_POLICY_RESOURCE, operation: PolicyOperation.read },
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/rbac/policies/assignable",
    middlewares: [
      validateAndTransformQuery(
        AdminGetRbacPoliciesParams,
        QueryConfig.listTransformQueryConfig
      ),
    ],
    policies: [
      { resource: RBAC_POLICY_RESOURCE, operation: PolicyOperation.read },
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
    policies: [
      { resource: RBAC_POLICY_RESOURCE, operation: PolicyOperation.read },
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/rbac/policies/:id/roles",
    middlewares: [
      validateAndTransformQuery(
        AdminGetRbacPolicyRolesParams,
        QueryConfig.listRbacPolicyRolesTransformQueryConfig
      ),
    ],
    policies: [
      { resource: RBAC_POLICY_RESOURCE, operation: PolicyOperation.read },
      { resource: RBAC_ROLE_RESOURCE, operation: PolicyOperation.read },
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
    policies: [
      { resource: RBAC_POLICY_RESOURCE, operation: PolicyOperation.create },
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
    policies: [
      { resource: RBAC_POLICY_RESOURCE, operation: PolicyOperation.update },
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/rbac/policies/:id",
    middlewares: [],
    policies: [
      { resource: RBAC_POLICY_RESOURCE, operation: PolicyOperation.delete },
    ],
  },
]
