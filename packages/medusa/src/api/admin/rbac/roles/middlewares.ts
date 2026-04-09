import * as QueryConfig from "./query-config"

import {
  validateAndTransformBody,
  validateAndTransformQuery,
} from "@medusajs/framework"
import { MiddlewareRoute } from "@medusajs/framework/http"
import { PolicyOperation } from "@medusajs/framework/utils"

import { Entities } from "./query-config"
import {
  AdminAddRolePoliciesType,
  AdminAssignRoleUsers,
  AdminCreateRbacRole,
  AdminGetRbacRoleParams,
  AdminGetRbacRolesParams,
  AdminGetRoleUsersParams,
  AdminRemoveRoleUsers,
  AdminUpdateRbacRole,
} from "./validators"

export const adminRbacRoleRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: ["GET"],
    matcher: "/admin/rbac/roles",
    middlewares: [
      validateAndTransformQuery(
        AdminGetRbacRolesParams,
        QueryConfig.listTransformQueryConfig
      ),
    ],
    policies: [
      {
        resource: Entities.rbac_role,
        operation: PolicyOperation.read,
      },
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/rbac/roles/:id",
    middlewares: [
      validateAndTransformQuery(
        AdminGetRbacRoleParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
    policies: [
      {
        resource: Entities.rbac_role,
        operation: PolicyOperation.read,
      },
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/rbac/roles",
    middlewares: [
      validateAndTransformBody(AdminCreateRbacRole),
      validateAndTransformQuery(
        AdminGetRbacRoleParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/rbac/roles/:id",
    middlewares: [
      validateAndTransformBody(AdminUpdateRbacRole),
      validateAndTransformQuery(
        AdminGetRbacRoleParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
    policies: [
      {
        resource: Entities.rbac_role,
        operation: PolicyOperation.update,
      },
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/rbac/roles/:id/policies",
    middlewares: [
      validateAndTransformQuery(
        AdminGetRbacRoleParams,
        QueryConfig.retrieveRolePoliciesTransformQueryConfig
      ),
    ],
    policies: [
      {
        resource: Entities.rbac_role,
        operation: PolicyOperation.read,
      },
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/rbac/roles/:id/policies",
    middlewares: [
      validateAndTransformBody(AdminAddRolePoliciesType),
      validateAndTransformQuery(
        AdminGetRbacRoleParams,
        QueryConfig.retrieveRolePoliciesTransformQueryConfig
      ),
    ],
    policies: [
      {
        resource: Entities.rbac_role,
        operation: PolicyOperation.update,
      },
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/rbac/roles/:id/policies/:policy_id",
    middlewares: [],
    policies: [
      {
        resource: Entities.rbac_role,
        operation: PolicyOperation.update,
      },
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/rbac/roles/:id/users",
    middlewares: [
      validateAndTransformQuery(
        AdminGetRoleUsersParams,
        QueryConfig.listRoleUsersTransformQueryConfig
      ),
    ],
    policies: [
      {
        resource: Entities.user,
        operation: PolicyOperation.read,
      },
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/rbac/roles/:id/users",
    middlewares: [validateAndTransformBody(AdminAssignRoleUsers)],
    policies: [
      {
        resource: Entities.user,
        operation: PolicyOperation.update,
      },
      {
        resource: Entities.rbac_role,
        operation: PolicyOperation.update,
      },
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/rbac/roles/:id/users",
    middlewares: [validateAndTransformBody(AdminRemoveRoleUsers)],
    policies: [
      {
        resource: Entities.user,
        operation: PolicyOperation.update,
      },
      {
        resource: Entities.rbac_role,
        operation: PolicyOperation.update,
      },
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/rbac/roles/:id",
    middlewares: [],
    policies: [
      {
        resource: Entities.rbac_role,
        operation: PolicyOperation.delete,
      },
    ],
  },
]
