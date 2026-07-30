import {
  validateAndTransformBody,
  validateAndTransformQuery,
} from "@medusajs/framework"
import { MiddlewareRoute } from "@medusajs/framework/http"
import { PolicyOperation } from "@medusajs/framework/utils"
import * as QueryConfig from "./query-config"
import { Entities } from "./query-config"
import {
  AdminAssignUserRole,
  AdminGetUserParams,
  AdminGetUserRolesParams,
  AdminGetUsersParams,
  AdminUnassignUserRole,
  AdminUnassignUserRoles,
  AdminUpdateUser,
} from "./validators"

export const adminUserRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: ["GET"],
    matcher: "/admin/users",
    middlewares: [
      validateAndTransformQuery(
        AdminGetUsersParams,
        QueryConfig.listTransformQueryConfig
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
    method: ["GET"],
    matcher: "/admin/users/:id",
    middlewares: [
      validateAndTransformQuery(
        AdminGetUserParams,
        QueryConfig.retrieveTransformQueryConfig
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
    method: ["GET"],
    matcher: "/admin/users/me",
    middlewares: [
      validateAndTransformQuery(
        AdminGetUserParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/users/:id",
    middlewares: [
      validateAndTransformBody(AdminUpdateUser),
      validateAndTransformQuery(
        AdminGetUserParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
    policies: [
      {
        resource: Entities.user,
        operation: PolicyOperation.update,
      },
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/users/:id",
    policies: [
      {
        resource: Entities.user,
        operation: PolicyOperation.delete,
      },
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/users/:id/roles",
    middlewares: [
      validateAndTransformQuery(
        AdminGetUserRolesParams,
        QueryConfig.listUserRolesTransformQueryConfig
      ),
    ],
    policies: [
      {
        resource: Entities.user,
        operation: PolicyOperation.read,
      },
      {
        resource: Entities.rbac_role,
        operation: PolicyOperation.read,
      },
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/users/:id/roles",
    middlewares: [validateAndTransformBody(AdminAssignUserRole)],
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
    matcher: "/admin/users/:id/roles/:role_id",
    middlewares: [validateAndTransformBody(AdminUnassignUserRole)],
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
    matcher: "/admin/users/:id/roles",
    middlewares: [validateAndTransformBody(AdminUnassignUserRoles)],
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
]
