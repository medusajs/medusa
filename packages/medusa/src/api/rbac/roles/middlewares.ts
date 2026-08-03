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
  AdminCreateRoleAssignments,
  AdminGetRbacRoleParams,
  AdminGetAssignableRbacRolesParams,
  AdminGetRbacRolesParams,
  AdminGetRoleAssignmentsParams,
  AdminGetRoleUsersParams,
  AdminRemoveRoleAssignments,
  AdminRemoveRoleUsers,
  AdminUpdateRbacRole,
} from "./validators"

export const rbacRoleRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: ["GET"],
    matcher: "/rbac/roles",
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
    matcher: "/rbac/roles/assignable",
    middlewares: [
      validateAndTransformQuery(
        AdminGetAssignableRbacRolesParams,
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
    matcher: "/rbac/roles/:id",
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
    matcher: "/rbac/roles",
    middlewares: [
      validateAndTransformBody(AdminCreateRbacRole),
      validateAndTransformQuery(
        AdminGetRbacRoleParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
    policies: [
      {
        resource: Entities.rbac_role,
        operation: PolicyOperation.create,
      },
    ],
  },
  {
    method: ["POST"],
    matcher: "/rbac/roles/:id",
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
    matcher: "/rbac/roles/:id/policies",
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
    matcher: "/rbac/roles/:id/policies",
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
    matcher: "/rbac/roles/:id/policies/:policy_id",
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
    matcher: "/rbac/roles/:id/users",
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
    matcher: "/rbac/roles/:id/users",
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
    matcher: "/rbac/roles/:id/users",
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
    method: ["GET"],
    matcher: "/rbac/roles/:id/assignments",
    middlewares: [
      validateAndTransformQuery(
        AdminGetRoleAssignmentsParams,
        QueryConfig.listRoleAssignmentsTransformQueryConfig
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
    matcher: "/rbac/roles/:id/assignments",
    middlewares: [
      validateAndTransformBody(AdminCreateRoleAssignments),
      validateAndTransformQuery(
        AdminGetRoleAssignmentsParams,
        QueryConfig.listRoleAssignmentsTransformQueryConfig
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
    matcher: "/rbac/roles/:id/assignments",
    middlewares: [validateAndTransformBody(AdminRemoveRoleAssignments)],
    policies: [
      {
        resource: Entities.rbac_role,
        operation: PolicyOperation.update,
      },
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/rbac/roles/:id",
    middlewares: [],
    policies: [
      {
        resource: Entities.rbac_role,
        operation: PolicyOperation.delete,
      },
    ],
  },
]
