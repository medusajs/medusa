import {
  validateAndTransformBody,
  validateAndTransformQuery,
} from "@medusajs/framework"
import { MiddlewareRoute } from "@medusajs/framework/http"

import * as QueryConfig from "./query-config"
import {
  AdminCreatePlatformSyncTask,
  AdminGetPlatformSyncTaskParams,
  AdminGetPlatformSyncTasksParams,
  AdminUpdatePlatformSyncTask,
} from "./validators"

export const adminPlatformSyncTaskRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: ["GET"],
    matcher: "/admin/platform-sync-tasks",
    middlewares: [
      validateAndTransformQuery(
        AdminGetPlatformSyncTasksParams,
        QueryConfig.listTransformQueryConfig
      ),
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/platform-sync-tasks/:id",
    middlewares: [
      validateAndTransformQuery(
        AdminGetPlatformSyncTaskParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/platform-sync-tasks",
    middlewares: [
      validateAndTransformBody(AdminCreatePlatformSyncTask),
      validateAndTransformQuery(
        AdminGetPlatformSyncTaskParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/platform-sync-tasks/:id",
    middlewares: [
      validateAndTransformBody(AdminUpdatePlatformSyncTask),
      validateAndTransformQuery(
        AdminGetPlatformSyncTaskParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/platform-sync-tasks/:id",
    middlewares: [],
  },
]
