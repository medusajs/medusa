import {
  validateAndTransformBody,
  validateAndTransformQuery,
} from "@medusajs/framework"
import { authorize, MiddlewareRoute } from "@medusajs/framework/http"
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
      authorize([
        {
          resource: Entities.user,
          operation: PolicyOperation.read,
        },
      ]),
      validateAndTransformQuery(
        AdminGetUsersParams,
        QueryConfig.listTransformQueryConfig
      ),
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/users/:id",
    middlewares: [
      authorize([
        {
          resource: Entities.user,
          operation: PolicyOperation.read,
        },
      ]),
      validateAndTransformQuery(
        AdminGetUserParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
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
      authorize([
        {
          resource: Entities.user,
          operation: PolicyOperation.update,
        },
      ]),
      validateAndTransformBody(AdminUpdateUser),
      validateAndTransformQuery(
        AdminGetUserParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/users/:id",
    middlewares: [
      authorize([
        {
          resource: Entities.user,
          operation: PolicyOperation.delete,
        },
      ]),
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/users/:id/auth-providers",
    middlewares: [
      authorize([
        {
          resource: Entities.user,
          operation: PolicyOperation.read,
        },
      ]),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/users/:id/reset-password",
    middlewares: [
      authorize([
        {
          resource: Entities.user,
          operation: PolicyOperation.update,
        },
      ]),
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/users/:id/roles",
    middlewares: [
      authorize([
        {
          resource: Entities.user,
          operation: PolicyOperation.read,
        },
        {
          resource: Entities.rbac_role,
          operation: PolicyOperation.read,
        },
      ]),
      validateAndTransformQuery(
        AdminGetUserRolesParams,
        QueryConfig.listUserRolesTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/users/:id/roles",
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
      validateAndTransformBody(AdminAssignUserRole),
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/users/:id/roles/:role_id",
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
      validateAndTransformBody(AdminUnassignUserRole),
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/users/:id/roles",
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
      validateAndTransformBody(AdminUnassignUserRoles),
    ],
  },
]
