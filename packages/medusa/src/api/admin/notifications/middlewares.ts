import { validateAndTransformQuery } from "@medusajs/framework"
import { authorize, MiddlewareRoute } from "@medusajs/framework/http"
import { PolicyOperation } from "@medusajs/framework/utils"
import * as QueryConfig from "./query-config"
import { Entities } from "./query-config"
import {
  AdminGetNotificationParams,
  AdminGetNotificationsParams,
} from "./validators"

export const adminNotificationRoutesMiddlewares: MiddlewareRoute[] = [
  {
    matcher: "/admin/notifications/*",
    middlewares: [
      authorize([
        {
          resource: Entities.notification,
          operation: PolicyOperation.read,
        },
      ]),
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/notifications",
    middlewares: [
      authorize([
        {
          resource: Entities.notification,
          operation: PolicyOperation.read,
        },
      ]),
      validateAndTransformQuery(
        AdminGetNotificationsParams,
        QueryConfig.listTransformQueryConfig
      ),
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/notifications/:id",
    middlewares: [
      validateAndTransformQuery(
        AdminGetNotificationParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
]
