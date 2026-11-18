import * as QueryConfig from "./query-config"

import {
  validateAndTransformBody,
  validateAndTransformQuery,
} from "@medusajs/framework"
import { authorize, MiddlewareRoute } from "@medusajs/framework/http"
import { PolicyOperation } from "@medusajs/framework/utils"

import {
  AdminCreateRbacPolicy,
  AdminGetAssignableRbacPoliciesParams,
  AdminGetRbacPoliciesParams,
  AdminGetRbacPolicyParams,
  AdminGetRbacPolicyRolesParams,
  AdminUpdateRbacPolicy,
} from "./validators"

const RBAC_POLICY_RESOURCE = "rbac_policy"
const RBAC_ROLE_RESOURCE = "rbac_role"

export const rbacPolicyRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: ["GET"],
    matcher: "/rbac/policies",
    middlewares: [
      authorize([
        { resource: RBAC_POLICY_RESOURCE, operation: PolicyOperation.read },
      ]),
      validateAndTransformQuery(
        AdminGetRbacPoliciesParams,
        QueryConfig.listTransformQueryConfig
      ),
    ],
  },
  {
    method: ["GET"],
    matcher: "/rbac/policies/assignable",
    middlewares: [
      authorize([
        { resource: RBAC_POLICY_RESOURCE, operation: PolicyOperation.read },
      ]),
      validateAndTransformQuery(
        AdminGetAssignableRbacPoliciesParams,
        QueryConfig.listTransformQueryConfig
      ),
    ],
  },
  {
    method: ["GET"],
    matcher: "/rbac/policies/:id",
    middlewares: [
      authorize([
        { resource: RBAC_POLICY_RESOURCE, operation: PolicyOperation.read },
      ]),
      validateAndTransformQuery(
        AdminGetRbacPolicyParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["GET"],
    matcher: "/rbac/policies/:id/roles",
    middlewares: [
      authorize([
        { resource: RBAC_POLICY_RESOURCE, operation: PolicyOperation.read },
        { resource: RBAC_ROLE_RESOURCE, operation: PolicyOperation.read },
      ]),
      validateAndTransformQuery(
        AdminGetRbacPolicyRolesParams,
        QueryConfig.listRbacPolicyRolesTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/rbac/policies",
    middlewares: [
      authorize([
        { resource: RBAC_POLICY_RESOURCE, operation: PolicyOperation.create },
      ]),
      validateAndTransformBody(AdminCreateRbacPolicy),
      validateAndTransformQuery(
        AdminGetRbacPolicyParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/rbac/policies/:id",
    middlewares: [
      authorize([
        { resource: RBAC_POLICY_RESOURCE, operation: PolicyOperation.update },
      ]),
      validateAndTransformBody(AdminUpdateRbacPolicy),
      validateAndTransformQuery(
        AdminGetRbacPolicyParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/rbac/policies/:id",
    middlewares: [
      authorize([
        { resource: RBAC_POLICY_RESOURCE, operation: PolicyOperation.delete },
      ]),
    ],
  },
]
