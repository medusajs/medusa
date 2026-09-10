import * as QueryConfig from "./query-config"

import {
  validateAndTransformBody,
  validateAndTransformQuery,
} from "@medusajs/framework"
import { authorize, MiddlewareRoute } from "@medusajs/framework/http"
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
      authorize([
        {
          resource: Entities.rbac_role,
          operation: PolicyOperation.read,
        },
      ]),
      validateAndTransformQuery(
        AdminGetRbacRolesParams,
        QueryConfig.listTransformQueryConfig
      ),
    ],
  },
  {
    method: ["GET"],
    matcher: "/rbac/roles/assignable",
    middlewares: [
      authorize([
        {
          resource: Entities.rbac_role,
          operation: PolicyOperation.read,
        },
      ]),
      validateAndTransformQuery(
        AdminGetAssignableRbacRolesParams,
        QueryConfig.listTransformQueryConfig
      ),
    ],
  },
  {
    method: ["GET"],
    matcher: "/rbac/roles/:id",
    middlewares: [
      authorize([
        {
          resource: Entities.rbac_role,
          operation: PolicyOperation.read,
        },
      ]),
      validateAndTransformQuery(
        AdminGetRbacRoleParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/rbac/roles",
    middlewares: [
      authorize([
        {
          resource: Entities.rbac_role,
          operation: PolicyOperation.create,
        },
      ]),
      validateAndTransformBody(AdminCreateRbacRole),
      validateAndTransformQuery(
        AdminGetRbacRoleParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/rbac/roles/:id",
    middlewares: [
      authorize([
        {
          resource: Entities.rbac_role,
          operation: PolicyOperation.update,
        },
      ]),
      validateAndTransformBody(AdminUpdateRbacRole),
      validateAndTransformQuery(
        AdminGetRbacRoleParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["GET"],
    matcher: "/rbac/roles/:id/policies",
    middlewares: [
      authorize([
        {
          resource: Entities.rbac_role,
          operation: PolicyOperation.read,
        },
      ]),
      validateAndTransformQuery(
        AdminGetRbacRoleParams,
        QueryConfig.retrieveRolePoliciesTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/rbac/roles/:id/policies",
    middlewares: [
      authorize([
        {
          resource: Entities.rbac_role,
          operation: PolicyOperation.update,
        },
      ]),
      validateAndTransformBody(AdminAddRolePoliciesType),
      validateAndTransformQuery(
        AdminGetRbacRoleParams,
        QueryConfig.retrieveRolePoliciesTransformQueryConfig
      ),
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/rbac/roles/:id/policies/:policy_id",
    middlewares: [
      authorize([
        {
          resource: Entities.rbac_role,
          operation: PolicyOperation.update,
        },
      ]),
    ],
  },
  {
    method: ["GET"],
    matcher: "/rbac/roles/:id/users",
    middlewares: [
      authorize([
        {
          resource: Entities.user,
          operation: PolicyOperation.read,
        },
      ]),
      validateAndTransformQuery(
        AdminGetRoleUsersParams,
        QueryConfig.listRoleUsersTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/rbac/roles/:id/users",
    middlewares: [
      authorize([
        {
          resource: Entities.user,
          operation: PolicyOperation.update,
        },
        {
          resource: Entities.rbac_role,
          operation: PolicyOperation.update,
        },
      ]),
      validateAndTransformBody(AdminAssignRoleUsers),
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/rbac/roles/:id/users",
    middlewares: [
      authorize([
        {
          resource: Entities.user,
          operation: PolicyOperation.update,
        },
        {
          resource: Entities.rbac_role,
          operation: PolicyOperation.update,
        },
      ]),
      validateAndTransformBody(AdminRemoveRoleUsers),
    ],
  },
  {
    method: ["GET"],
    matcher: "/rbac/roles/:id/assignments",
    middlewares: [
      authorize([
        {
          resource: Entities.rbac_role,
          operation: PolicyOperation.read,
        },
      ]),
      validateAndTransformQuery(
        AdminGetRoleAssignmentsParams,
        QueryConfig.listRoleAssignmentsTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/rbac/roles/:id/assignments",
    middlewares: [
      authorize([
        {
          resource: Entities.rbac_role,
          operation: PolicyOperation.update,
        },
      ]),
      validateAndTransformBody(AdminCreateRoleAssignments),
      validateAndTransformQuery(
        AdminGetRoleAssignmentsParams,
        QueryConfig.listRoleAssignmentsTransformQueryConfig
      ),
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/rbac/roles/:id/assignments",
    middlewares: [
      authorize([
        {
          resource: Entities.rbac_role,
          operation: PolicyOperation.update,
        },
      ]),
      validateAndTransformBody(AdminRemoveRoleAssignments),
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/rbac/roles/:id",
    middlewares: [
      authorize([
        {
          resource: Entities.rbac_role,
          operation: PolicyOperation.delete,
        },
      ]),
    ],
  },
]
